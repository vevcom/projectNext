import '@pn-server-only'
import { permissionAuthers } from './auther'
import { defineOperation } from '@/services/serviceOperation'
import { ServerOnlyAuther } from '@/auth/auther/RequireServer'
import { invalidateAllUserSessionData, invalidateManyUserSessionData } from '@/services/auth/invalidateSession'
import { groupsWithRelationsIncluder } from '@/services/groups/constants'
import { checkGroupValidity, inferGroupName } from '@/services/groups/operations'
import { Permission } from '@prisma/client'
import { z } from 'zod'


export const permissionOperations = {
    readDefaultPermissions: defineOperation({
        authorizer: () => permissionAuthers.readDefaultPermissions.dynamicFields({}),
        operation: async ({ prisma }) =>
            (await prisma.defaultPermission.findMany()).map(perm => perm.permission)
    }),

    readPermissionsOfUser: defineOperation({
        authorizer: ServerOnlyAuther,
        paramsSchema: z.object({
            userId: z.number(),
        }),
        operation: async ({ prisma, params }) => {
            const [defaultPermissions, groupPermissions] = await Promise.all([
                permissionOperations.readDefaultPermissions({}),
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

    readPermissionsOfGroup: defineOperation({
        authorizer: () => permissionAuthers.readGroupPermissions.dynamicFields({}),
        paramsSchema: z.object({
            groupId: z.number()
        }),
        operation: async ({ prisma, params }) => (await prisma.groupPermission.findMany({
            where: {
                groupId: params.groupId
            }
        })).map(permission => permission.permission)
    }),

    readPermissionMatrix: defineOperation({
        authorizer: () => permissionAuthers.readPermissionMatrix.dynamicFields({}),
        operation: async ({ prisma }) => {
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

    updateDefaultPermissions: defineOperation({
        authorizer: () => permissionAuthers.updateDefaultPermissions.dynamicFields({}),
        dataSchema: z.object({
            permissions: z.nativeEnum(Permission).array(),
        }),
        operation: async ({ prisma, data }) => {
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

    updateGroupPermission: defineOperation({
        authorizer: () => permissionAuthers.updateGroupPermission.dynamicFields({}),
        paramsSchema: z.object({
            groupId: z.number(),
            permission: z.nativeEnum(Permission),
        }),
        dataSchema: z.object({
            value: z.boolean()
        }),
        operation: async ({ prisma, params, data }) => {
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
