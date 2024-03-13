import 'server-only'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import { invalidateOneUserSessionData } from '@/server/auth/invalidateSession'
import type { ActionReturn } from '@/actions/Types'
import type { RoleWithPermissions } from './Types'

export async function createRole(data: { name: string }): Promise<ActionReturn<RoleWithPermissions>> {
    try {
        const role = await prisma.role.create({
            data,
            select: {
                id: true,
                name: true,
                permissions: {
                    select: {
                        permission: true
                    }
                }
            }
        })

        return { success: true, data: role }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function addUserToRole(
    username: string,
    roleId: number
): Promise<ActionReturn<void, false>> {
    //TODO: Auth
    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id: true
            },
        })

        if (!user) return createActionError('BAD PARAMETERS', 'Invalid username')

        return await addUserByIdToRole(user.id, roleId)
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function addUserByIdToRole(userId: number, roleId: number): Promise<ActionReturn<void, false>> {
    return addUserByIdToRoles(userId, [roleId])
}

export async function addUserByIdToRoles(userId: number, roleIds: number[]): Promise<ActionReturn<void, false>> {
    try {
        await prisma.rolesUsers.createMany({
            data: roleIds.map(roleId => ({
                userId,
                roleId,
            }))
        })

        const res = await invalidateOneUserSessionData(userId)

        if (!res.success) return res
    } catch (e) {
        return createPrismaActionError(e)
    }

    return { success: true }
}
