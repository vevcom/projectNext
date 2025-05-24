import '@pn-server-only'
import { allMethodsOn } from '@/services/notifications/Types'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { Subscription } from '@/services/notifications/subscription/Types'


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
