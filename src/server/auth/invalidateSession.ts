import prisma from "@/prisma"
import { createPrismaActionError, createActionError } from "@/actions/error"
import type { ActionReturn } from "@/actions/Types"

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