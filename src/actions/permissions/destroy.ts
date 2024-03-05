'use server'

import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import prisma from '@/prisma'
import { invalidateManyUserSessionData, invalidateOneUserSessionData } from '@/actions/users/update'
import { z } from 'zod'
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
        return createPrismaActionError(e)
    }
}

export async function removeUserFromRole(data: FormData): Promise<ActionReturn<void, false>> {
    const schema = z.object({
        roleId: z.coerce.number(),
        username: z.string(),
    })

    const parse = schema.safeParse({
        roleId: data.get('roleId'),
        username: data.get('username'),
    })

    if (!parse.success) return createZodActionError(parse)

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

        if (!user) return createActionError('BAD PARAMETERS', 'Invalid username')

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
        return createPrismaActionError(e)
    }

    return { success: true }
}
