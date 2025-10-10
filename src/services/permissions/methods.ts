import '@pn-server-only'
import { permissionAuthers } from './auther'
import { serviceMethod } from '@/services/serviceMethod'
import { ServerOnlyAuther } from '@/auth/auther/RequireServer'
import { invalidateAllUserSessionData, invalidateManyUserSessionData } from '@/services/auth/invalidateSession'
import { groupsWithRelationsIncluder } from '@/services/groups/config'
import { checkGroupValidity, inferGroupName } from '@/services/groups/methods'
import { Permission } from '@prisma/client'
import { z } from 'zod'


export const permissionMethods = {
    readDefaultPermissions: serviceMethod({
        authorizer: () => permissionAuthers.readDefaultPermissions.dynamicFields({}),
        method: async ({ prisma }) =>
            (await prisma.defaultPermission.findMany()).map(perm => perm.permission)
    }),

    readPermissionsOfUser: serviceMethod({
        authorizer: ServerOnlyAuther,
        paramsSchema: z.object({
            userId: z.number(),
        }),
        method: async ({ prisma, params }) => {
            const [defaultPermissions, groupPermissions] = await Promise.all([
                permissionMethods.readDefaultPermissions({}),
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
            const ret: Permission[] = defaultPermissions.concat(groupPermsFlatten)

            return ret.filter((permission, i) => ret.indexOf(permission) === i)
        }
    }),

    readPermissionsOfGroup: serviceMethod({
        authorizer: () => permissionAuthers.readGroupPermissions.dynamicFields({}),
        paramsSchema: z.object({
            groupId: z.number()
        }),
        method: async ({ prisma, params }) => (await prisma.groupPermission.findMany({
            where: {
                groupId: params.groupId
            }
        })).map(permission => permission.permission)
    }),

    readPermissionMatrix: serviceMethod({
        authorizer: () => permissionAuthers.readPermissionMatrix.dynamicFields({}),
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
    }),

    updateDefaultPermissions: serviceMethod({
        authorizer: () => permissionAuthers.updateDefaultPermissions.dynamicFields({}),
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
    }),

    updateGroupPermission: serviceMethod({
        authorizer: () => permissionAuthers.updateGroupPermission.dynamicFields({}),
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
    }),
}
