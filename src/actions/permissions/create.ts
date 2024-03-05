'use server'

import prisma from '@/prisma'
import { invalidateOneUserSessionData } from '@/actions/users/update'
import { z } from 'zod'
import type { ActionReturn } from '@/actions/Types'
import type { Prisma } from '@prisma/client'
import { createActionError, createPrismaActionError, createZodActionError } from '../error'

type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: { select: { permission: true } } } }>

export async function createRole(data: FormData): Promise<ActionReturn<RoleWithPermissions>> {
    const schema = z.object({ name: z.string() })

    const parse = schema.safeParse({
        name: data.get('name')
    })

    if (!parse.success) return createZodActionError(parse)

    const { name } = parse.data

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
        return createPrismaActionError(e)
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

        await prisma.rolesUsers.create({
            data: {
                roleId,
                userId: user.id,
            },
        })

        const res = await invalidateOneUserSessionData(user.id)

        if (!res.success) return res
    } catch (e) {
        return createPrismaActionError(e)
    }

    return { success: true }
}
