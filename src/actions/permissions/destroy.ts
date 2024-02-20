'use server'

import errorHandeler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { z } from 'zod'
import type { ActionReturn } from '@/actions/type'
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
                }
            }
        })

        return { success: true, data: role }
    } catch (e) {
        return errorHandeler(e)
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
    } catch (e) {
        return errorHandeler(e)
    }

    return { success: true, data: undefined }
}
