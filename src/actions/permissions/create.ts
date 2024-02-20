'use server'

import errorHandeler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { z } from 'zod'
import type { ActionReturn } from '@/actions/Types'
import type { Prisma } from '@prisma/client'

type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: { select: { permission: true } } } }>

export async function createRole(data: FormData): Promise<ActionReturn<RoleWithPermissions>> {
    const schema = z.object({ name: z.string() })

    const parse = schema.safeParse({
        name: data.get('name')
    })

    if (!parse.success) return { success: false, error: parse.error.issues }


    const { name } = parse.data

    if (!name) return { success: false }

    try {
        const role = await prisma.role.create({
            data: { name },
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

export async function addUserToRole(data: FormData): Promise<ActionReturn<void, false>> {
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
    console.log(roleId)

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

        await prisma.rolesUsers.create({
            data: {
                roleId,
                userId: user.id,
            },
        })
    } catch (e) {
        return errorHandeler(e)
    }

    return { success: true }
}
