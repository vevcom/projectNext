import { createPrismaActionError, createZodActionError } from '@/actions/error'
import prisma from '@/prisma'
import { invalidateManyUserSessionData } from '@/server/auth/invalidateSession'
import type { ActionReturn } from '@/actions/Types'
import { Prisma } from '@prisma/client'
import type { Permission } from '@prisma/client'

/**
 * A function that updates a role. The given permissions will be set as the new permissions for the role.
 * All other permissions will be removed.
 * @param id - The id of the role to update
 * @param data - The new data for the role
 * @param permissions - The new permissions for the role
 * @returns 
 */
export async function updateRole(
    id: number, 
    data: Prisma.RoleUpdateInput,
    permissions: Permission[]
): Promise<ActionReturn<void, false>> {
    let userIds: number[]

    // Update name of role
    try {
        const role = await prisma.role.update({
            where: {
                id
            },
            data,
            select: {
                users: {
                    select: {
                        userId: true,
                    },
                },
            },
        })

        userIds = role.users.map(user => user.userId)
    } catch (e) {
        return createPrismaActionError(e)
    }

    // Delete removed permissions
    try {
        await prisma.rolePermission.deleteMany({
            where: {
                roleId: id,
                permission: {
                    not: {
                        in: permissions
                    }
                }
            }
        })
    } catch (e) {
        return createPrismaActionError(e)
    }

    // Create added permissions
    try {
        await prisma.rolePermission.createMany({
            data: permissions.map(permission => ({
                roleId: id,
                permission,
            })),
            skipDuplicates: true
        })
    } catch (e) {
        return createPrismaActionError(e)
    }

    const res = await invalidateManyUserSessionData(userIds)

    if (!res.success) return res

    return { success: true }
}
