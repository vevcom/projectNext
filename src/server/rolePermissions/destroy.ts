import 'server-only'
import prisma from '@/prisma'
import { invalidateManyUserSessionData, invalidateOneUserSessionData } from '@/server/auth/invalidateSession'
import type { RoleWithPermissions } from './Types'
import { prismaCall } from '../prismaCall'
import { ServerError } from '../error'

/**
 * A function that delets a role, it will also invalidate the session of all users that have the role
 * @param roleId - The id of the role to destroy
 * @returns
 */
export async function destroyRole(roleId: number): Promise<RoleWithPermissions> {
    const role = await prismaCall(() => prisma.role.delete({
        where: {
            id: roleId
        },
        select: {
            id: true,
            name: true,
            permissions: {
                select: {
                    permission: true
                }
            },
            users: {
                select: {
                    userId: true
                }
            }
        }
    }))

    await invalidateManyUserSessionData(role.users.map(user => user.userId))
    return role
}

/**
 * A function that removes a user from a role. It will also invalidate the session of the user
 * @param username - The username of the user to remove from the role
 * @param roleId - The id of the role to remove the user from
 * @returns
 */
export async function removeUserFromRole(
    username: string,
    roleId: number
): Promise<void> {
    const user = await prismaCall(() => prisma.user.findUnique({
        where: {
            username
        },
        select: {
            id: true
        },
    }))

    if (!user) throw new ServerError('BAD PARAMETERS', 'User not found')

    await prismaCall(() => prisma.rolesUsers.delete({
        where: {
            userId_roleId: {
                roleId,
                userId: user.id
            }
        },
    }))

    await invalidateOneUserSessionData(user.id)
}
