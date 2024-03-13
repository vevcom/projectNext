'use server'
import { removeUserFromRoleSchema } from './schema'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import prisma from '@/prisma'
import { invalidateOneUserSessionData } from '@/server/auth/invalidateSession'
import type { RemoveUserFromRoleSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { Prisma } from '@prisma/client'
import { destroyRole } from '@/server/rolePermissions/destroy'

type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: { select: { permission: true } } } }>

export async function destroyRoleAction(roleId: number): Promise<ActionReturn<RoleWithPermissions>> {
    //TODO: Auth
    return await destroyRole(roleId)
}

export async function removeUserFromRole(
    rawdata: FormData | RemoveUserFromRoleSchemaType
): Promise<ActionReturn<void, false>> {
    const parse = removeUserFromRoleSchema.safeParse(rawdata)

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
