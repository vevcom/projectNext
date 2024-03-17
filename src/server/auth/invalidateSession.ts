import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'

export async function invalidateOneUserSessionData(userId: number): Promise<void> {
    await prismaCall(() => prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            updatedAt: new Date(),
        }
    }))
}

export async function invalidateManyUserSessionData(userIds: number[]): Promise<void> {
    await Promise.all(userIds.map(userId => invalidateOneUserSessionData(userId)))
}
