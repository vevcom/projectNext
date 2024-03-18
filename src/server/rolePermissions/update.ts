import 'server-only'
import { readUsersOfRole } from './read'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { invalidateManyUserSessionData } from '@/server/auth/invalidateSession'
import type { Prisma, Permission } from '@prisma/client'
import type { RoleWithPermissions } from './Types'

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
): Promise<RoleWithPermissions> {
    // Update name of role
    const role = await prismaCall(() => prisma.role.update({
        where: {
            id
        },
        include: {
            permissions: {
                select: {
                    permission: true,
                },
            },
        },
        data,
    }))

    // Delete removed permissions
    await prismaCall(() => prisma.rolePermission.deleteMany({
        where: {
            roleId: id,
            permission: {
                not: {
                    in: permissions
                }
            }
        }
    }))

    // Create added permissions
    await prismaCall(() => prisma.rolePermission.createMany({
        data: permissions.map(permission => ({
            roleId: id,
            permission,
        })),
        skipDuplicates: true
    }))

    const users = await readUsersOfRole(role.id)
    await invalidateManyUserSessionData(users.map(user => user.id))

    return role
}

