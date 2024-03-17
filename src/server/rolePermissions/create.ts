import 'server-only'
import prisma from '@/prisma'
import { invalidateOneUserSessionData } from '@/server/auth/invalidateSession'
import type { ActionReturn } from '@/actions/Types'
import type { RoleWithPermissions } from './Types'
import { prismaCall } from '../prismaCall'
import { ServerError } from '../error'

export async function createRole(data: { name: string }): Promise<RoleWithPermissions> {
    return await prismaCall(() => prisma.role.create({
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
    }))
}

export async function addUserToRole(
    username: string,
    roleId: number
): Promise<void> {
    //TODO: Auth
    const user = await prismaCall(() =>prisma.user.findUnique({
        where: {
            username
        },
        select: {
            id: true
        },
    }))

    if (!user) throw new ServerError('BAD PARAMETERS', 'User not found')

    return await addUserByIdToRole(user.id, roleId)
}

export async function addUserByIdToRole(userId: number, roleId: number): Promise<void> {
    return addUserByIdToRoles(userId, [roleId])
}

export async function addUserByIdToRoles(userId: number, roleIds: number[]): Promise<void> {
    await prismaCall(() => prisma.rolesUsers.createMany({
        data: roleIds.map(roleId => ({
            userId,
            roleId,
        }))
    }))

    await invalidateOneUserSessionData(userId)
}
