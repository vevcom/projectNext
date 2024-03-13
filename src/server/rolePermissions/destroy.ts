import 'server-only'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import { invalidateManyUserSessionData, invalidateOneUserSessionData } from '@/server/auth/invalidateSession'
import type { ActionReturn } from '@/actions/Types'
import type { RoleWithPermissions } from './Types'

/**
 * A function that delets a role, it will also invalidate the session of all users that have the role
 * @param roleId - The id of the role to destroy
 * @returns 
 */
export async function destroyRole(roleId: number): Promise<ActionReturn<RoleWithPermissions>> {    
    try {
        const role = await prisma.role.delete({
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
        })

        const res = await invalidateManyUserSessionData(role.users.map(user => user.userId))

        if (!res.success) return res

        return { success: true, data: role }
    } catch (e) {
        return createPrismaActionError(e)
    }
}