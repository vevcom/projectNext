import '@pn-server-only'
import { readUsersOfRole } from './read'
import { expandedRoleIncluder } from './ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import { invalidateManyUserSessionData } from '@/services/auth/invalidateSession'
import type { ExpandedRole } from './Types'

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
