'use server'

import errorHandeler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { invalidateOneUserSessionData } from '@/actions/users/update'
import type { ActionReturn } from '@/actions/Types'
import type { Prisma } from '@prisma/client'
import type { CreateRoleSchemaType, AddUserToRoleSchemaType } from './schema'
import { createRoleSchema, addUserToRoleSchema } from './schema'

type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: { select: { permission: true } } } }>

export async function createRole(rawdata: FormData | CreateRoleSchemaType): Promise<ActionReturn<RoleWithPermissions>> {
    const parse = createRoleSchema.safeParse(rawdata)

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

export async function addUserToRole(rawdata: FormData | AddUserToRoleSchemaType): Promise<ActionReturn<void, false>> {
    const parse = addUserToRoleSchema.safeParse(rawdata)

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

        await prisma.rolesUsers.create({
            data: {
                roleId,
                userId: user.id,
            },
        })

        const res = await invalidateOneUserSessionData(user.id)

        if (!res.success) return res
    } catch (e) {
        return errorHandeler(e)
    }

    return { success: true }
}
