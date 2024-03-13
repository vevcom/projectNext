'use server'

import { createRoleSchema, addUserToRoleSchema } from './schema'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import prisma from '@/prisma'
import { invalidateOneUserSessionData } from '@/server/auth/invalidateSession'
import type { ActionReturn } from '@/actions/Types'
import type { RoleWithPermissions } from '@/server/permissions/Types'
import type { CreateRoleSchemaType, AddUserToRoleSchemaType } from './schema'
import { createRole } from '@/server/permissions/create'


export async function createRoleAction(rawdata: FormData | CreateRoleSchemaType): Promise<ActionReturn<RoleWithPermissions>> {
    //TODO: Auth
    
    const parse = createRoleSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await createRole(data)
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
