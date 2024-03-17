import prisma from '@/prisma'
import { prismaCall } from '../prismaCall'

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
    const results = await Promise.all(userIds.map(userId => invalidateOneUserSessionData(userId)))
}
