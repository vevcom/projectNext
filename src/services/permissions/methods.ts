import '@pn-server-only'
import { PermissionAuthers } from './auther'
import { ServiceMethod } from '@/services/ServiceMethod'
import { ServerOnlyAuther } from '@/auth/auther/RequireServer'
import { z } from 'zod'
import { Permission } from '@prisma/client'
import { invalidateAllUserSessionData, invalidateManyUserSessionData } from '../auth/invalidateSession'
import { groupsWithRelationsIncluder } from '../groups/config'
import { checkGroupValidity, inferGroupName } from '../groups/methods'


export namespace PermissionMethods {

    export const readDefaultPermissions = ServiceMethod({
        auther: () => PermissionAuthers.readDefaultPermissions.dynamicFields({}),
        method: async ({ prisma }) =>
            (await prisma.defaultPermission.findMany()).map(perm => perm.permission)
    })

    export const readPermissionsOfUser = ServiceMethod({
        auther: ServerOnlyAuther,
        paramsSchema: z.object({
            userId: z.number(),
        }),
        method: async ({ prisma, session, params }) => {
            const [defaultPermissions, groupPermissions] = await Promise.all([
                readDefaultPermissions.client(prisma).execute({
                    bypassAuth: true,
                    session,
                }),
                prisma.membership.findMany({
                    where: {
                        userId: params.userId,
                        active: true,
                    },
                    select: {
                        group: {
                            select: {
                                permissions: true
                            }
                        }
                    }
                })
            ])


            const groupPermsFlatten = groupPermissions.map(group =>
                group.group.permissions.map(permission => permission.permission)
            ).flat()
            const ret = defaultPermissions.concat(groupPermsFlatten)

            return ret.filter((permission, i) => ret.indexOf(permission) === i)
        }
    })

    export const readPermissionsOfGroup = ServiceMethod({
        auther: () => PermissionAuthers.readGroupPermissions.dynamicFields({}),
        paramsSchema: z.object({
            groupId: z.number()
        }),
        method: async ({ prisma, params }) => (await prisma.groupPermission.findMany({
            where: {
                groupId: params.groupId
            }
        })).map(permission => permission.permission)
    })

    export const readPermissionMatrix = ServiceMethod({
        auther: () => PermissionAuthers.readPermissionMatrix.dynamicFields({}),
        method: async ({ prisma }) => {
            const groupsPermission = await prisma.group.findMany({
                include: {
                    ...groupsWithRelationsIncluder,
                    permissions: true
                }
            })

            return groupsPermission.map(group => ({
                ...group,
                name: inferGroupName(checkGroupValidity(group)),
                permissions: group.permissions.map(permission => permission.permission)
            }))
        }
    })

    export const updateDefaultPermissions = ServiceMethod({
        auther: () => PermissionAuthers.updateDefaultPermissions.dynamicFields({}),
        dataSchema: z.object({
            permissions: z.nativeEnum(Permission).array(),
        }),
        method: async ({ prisma, data }) => {
            await prisma.defaultPermission.deleteMany({
                where: {
                    permission: {
                        notIn: data.permissions,
                    },
                },
            })

            await prisma.defaultPermission.createMany({
                data: data.permissions.map(permission => ({
                    permission,
                })),
                skipDuplicates: true,
            })

            // Invalidate all user sessions
            await invalidateAllUserSessionData()

            return data.permissions
        }
    })

    export const updateGroupPermission = ServiceMethod({
        auther: () => PermissionAuthers.updateGroupPermission.dynamicFields({}),
        paramsSchema: z.object({
            groupId: z.number(),
            permission: z.nativeEnum(Permission),
        }),
        dataSchema: z.object({
            value: z.boolean()
        }),
        method: async ({ prisma, params, data }) => {
            if (data.value) {
                await prisma.groupPermission.create({
                    data: {
                        groupId: params.groupId,
                        permission: params.permission,
                    },
                })
            } else {
                await prisma.groupPermission.delete({
                    where: {
                        groupId_permission: {
                            groupId: params.groupId,
                            permission: params.permission,
                        }
                    },
                })
            }

            const group = await prisma.group.findUniqueOrThrow({
                where: {
                    id: params.groupId
                },
                select: {
                    memberships: {
                        select: {
                            userId: true,
                        },
                        where: {
                            active: true,
                        }
                    }
                }
            })

            const userIds = group.memberships.map(membership => membership.userId)
            await invalidateManyUserSessionData(userIds)

            return data.value
        }
    })
}
