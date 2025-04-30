import { PermissionSchemas } from './schemas'
import { ServiceMethod } from '@/services/ServiceMethod'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import { z } from 'zod'

export namespace PermissionMethods {
    /**
     * Reads all the permissions for a specific user.
     */
    export const readPermissionsOfUser = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: z.object({
            id: z.coerce.number(),
        }),
        method: async ({ prisma, params }) => {
            const memberships = await prisma.membership.findMany({
                where: {
                    userId: params.id,
                    active: true,
                },
                select: {
                    group: {
                        select: {
                            permissions: true,
                        },
                    },
                    admin: true,
                },
            })

            const userPermissions = new Set(
                memberships.flatMap(membership =>
                    membership.group.permissions
                        .filter(p => !p.forAdminsOnly || membership.admin)
                        .map(p => p.permission)
                )
            )

            const defaultPermissions = new Set((await prisma.defaultPermission.findMany()).map(p => p.permission))

            return Array.from(userPermissions.union(defaultPermissions))
        },
    })

    /**
     * Updates the default permissions for a specific gruop.
     * This will remove all permissions that are not in the new list and
     * add all permissions that are in the new list but not in the old list.
     */
    export const updateGroupPermissions = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: z.object({
            id: z.coerce.number(),
        }),
        dataSchema: PermissionSchemas.updateGroupPermissions,
        method: async ({ prisma, params, data }) => {
            // Delete removed permissions
            await prisma.groupPermission.deleteMany({
                where: {
                    groupId: params.id,
                    permission: {
                        not: {
                            in: data.permissions,
                        },
                    },
                },
            })

            // Create added permissions
            await prisma.groupPermission.createMany({
                data: data.permissions.map(permission => ({
                    groupId: params.id,
                    permission,
                    forAdminsOnly: false,
                })),
                skipDuplicates: true,
            })
        },
    })

    /**
     * Reads all default permissions which all users have by default.
     */
    export const readDefaultPermissions = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}),
        method: async ({ prisma }) => (await prisma.defaultPermission.findMany()).map(p => p.permission),
    })

    /**
     * Updates the default permissions for all users.
     * This will remove all permissions that are not in the new list and
     * add all permissions that are in the new list but not in the old list.
     */
    export const updateDefaultPermissions = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}),
        dataSchema: PermissionSchemas.updateDefaultPermissions,
        method: async ({ prisma, data }) => {
            // Delete removed permissions
            await prisma.defaultPermission.deleteMany({
                where: {
                    permission: {
                        not: {
                            in: data.permissions,
                        },
                    },
                },
            })

            // Create added permissions
            await prisma.defaultPermission.createMany({
                data: data.permissions.map(permission => ({ permission })),
                skipDuplicates: true,
            })
        },
    })
}
