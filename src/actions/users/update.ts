'use server'
import errorHandler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'

// These function should maybe be in another place than server actions? @Paulijuz

export async function invalidateOneUserSessionData(userId: number): Promise<ActionReturn<void, false>> {
    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {}
        })
    } catch (e) {
        return errorHandler(e)
    }

    return { success: true, data: undefined }
}

export async function invalidateManyUserSessionData(userIds: number[]): Promise<ActionReturn<void, false>> {
    const results = await Promise.all(userIds.map(userId => invalidateOneUserSessionData(userId)))

    if (results.some(result => !result.success)) return { success: false }

    return { success: true, data: undefined }
}
