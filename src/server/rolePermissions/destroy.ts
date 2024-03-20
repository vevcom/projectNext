import 'server-only'
import { readUsersOfRole } from './read'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { invalidateManyUserSessionData } from '@/server/auth/invalidateSession'
import type { ExpandedRole } from './Types'
import { expandedRoleIncluder } from './ConfigVars'

/**
 * A function that delets a role, it will also invalidate the session of all users that have the role
 * @param roleId - The id of the role to destroy
 * @returns
 */
export async function destroyRole(roleId: number): Promise<ExpandedRole> {
    const role = await prismaCall(() => prisma.role.delete({
        where: {
            id: roleId
        },
        include: expandedRoleIncluder,
    }))

    const users = await readUsersOfRole(role.id)
    await invalidateManyUserSessionData(users.map(user => user.id))

    return role
}
