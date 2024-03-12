'use server'

import { updateUserSchema } from './schema'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'
import type { UpdateUserSchemaType } from './schema'


export async function updateUser(id: number, rawdata: FormData | UpdateUserSchemaType): Promise<ActionReturn<User>> {
    const parse = updateUserSchema.safeParse(rawdata)

    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data
        })
        return { success: true, data: user }
    } catch (error) {
        return createPrismaActionError(error)
    }
}



// These function should maybe be in another place than server actions? @Paulijuz

export async function invalidateOneUserSessionData(userId: number): Promise<ActionReturn<void, false>> {
    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                updatedAt: new Date(),
            }
        })
    } catch (e) {
        return createPrismaActionError(e)
    }

    return { success: true }
}

export async function invalidateManyUserSessionData(userIds: number[]): Promise<ActionReturn<void, false>> {
    const results = await Promise.all(userIds.map(userId => invalidateOneUserSessionData(userId)))

    if (results.some(result => !result.success)) return createActionError('UNKNOWN ERROR')

    return { success: true }
}
