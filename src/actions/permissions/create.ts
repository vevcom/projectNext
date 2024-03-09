'use server'

import { createRoleSchema, addUserToRoleSchema } from './schema'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import prisma from '@/prisma'
import { invalidateOneUserSessionData } from '@/actions/users/update'
import type { ActionReturn } from '@/actions/Types'
import type { Prisma } from '@prisma/client'
import type { CreateRoleSchemaType, AddUserToRoleSchemaType } from './schema'

type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: { select: { permission: true } } } }>

export async function createRole(rawdata: FormData | CreateRoleSchemaType): Promise<ActionReturn<RoleWithPermissions>> {
    const parse = createRoleSchema.safeParse(rawdata)

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

export async function addUserToRole(rawdata: FormData | AddUserToRoleSchemaType): Promise<ActionReturn<void, false>> {
    const parse = addUserToRoleSchema.safeParse(rawdata)

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
