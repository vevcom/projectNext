import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { invalidateManyUserSessionData, invalidateOneUserSessionData } from '@/server/auth/invalidateSession'
import type { RoleWithPermissions } from './Types'
import {  } from '../groups/read'
import { readUsersOfRole } from './read'

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
        include: {
            permissions: {
                select: {
                    permission: true
                }
            },
        }
    }))

    const users = await readUsersOfRole(role.id)
    await invalidateManyUserSessionData(users.map(user => user.id))

    return role
}