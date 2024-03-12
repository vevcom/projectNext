import 'server-only'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import { Prisma } from '@prisma/client'
import type { User } from '@prisma/client'

export async function updateUser(id: number, data: Prisma.UserUpdateInput): Promise<ActionReturn<User>> {
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