import 'server-only'
import { readDefaultNotificationChannels } from '@/services/notifications/channel/read'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'


export async function createDefaultSubscriptions(userId: number): Promise<void> {
    const channels = await readDefaultNotificationChannels()

    await prismaCall(() => prisma.$transaction(channels.map(c =>
        prisma.notificationSubscription.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    }
                },
                channel: {
                    connect: {
                        id: c.id,
                    }
                },
                methods: {
                    create: c.defaultMethods,
                }
            }
        })
    )))
}
