import 'server-only'
import { allMethodsOn } from '@/server/notifications/Types'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { Subscription } from '@/server/notifications/subscription/Types'


export async function readUserSubscriptions(userId: number): Promise<Subscription[]> {
    return await prismaCall(() => prisma.notificationSubscription.findMany({
        where: {
            userId,
        },
        include: {
            methods: {
                select: allMethodsOn,
            },
        },
    }))
}
