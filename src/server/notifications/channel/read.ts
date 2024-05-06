import 'server-only'
import { allMethodsOn } from '@/server/notifications/Types'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { NotificationChannel } from '@/server/notifications/Types'


export async function readAllNotificationChannels(): Promise<NotificationChannel[]> {
    return await prismaCall(() => prisma.notificationChannel.findMany({
        include: {
            defaultMethods: {
                select: allMethodsOn,
            },
            availableMethods: {
                select: allMethodsOn,
            },
        },
    }))
}
