import 'server-only'
import { allMethodsOn } from '../Types';
import { prismaCall } from '@/server/prismaCall';
import prisma from '@/prisma';
import { Subscription } from '../subscription/Types';



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