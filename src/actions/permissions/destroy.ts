'use server'

import { removeUserFromRoleSchema } from './schema'
import errorHandeler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { invalidateManyUserSessionData, invalidateOneUserSessionData } from '@/actions/users/update'
import type { RemoveUserFromRoleSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { Prisma } from '@prisma/client'

type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: { select: { permission: true } } } }>

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
        return errorHandeler(e)
    }
}

export async function removeUserFromRole(
    rawdata: FormData | RemoveUserFromRoleSchemaType
): Promise<ActionReturn<void, false>> {
    const parse = removeUserFromRoleSchema.safeParse(rawdata)

    if (!parse.success) return { success: false, error: parse.error.issues }

    const { roleId, username } = parse.data

    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id: true
            },
        })

        if (!user) return { success: false, error: [{ message: 'Invalid username' }] }

        await prisma.rolesUsers.delete({
            where: {
                userId_roleId: {
                    roleId,
                    userId: user.id
                }
            },
        })

        const res = await invalidateOneUserSessionData(user.id)

        if (!res.success) return res
    } catch (e) {
        return errorHandeler(e)
    }

    return { success: true }
}
