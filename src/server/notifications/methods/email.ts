import 'server-only'
import type { Notification, NotificationChannel } from '@prisma/client'
import { prismaCall } from '@/server/prismaCall'

export async function dispatchEmailNotifications(
    notification: Notification,
    channel: Pick<NotificationChannel, 'id' | 'name'>,
    usersIds: number[]
): Promise<void> {
    console.log("SEND EMAIL")
    console.log(usersIds)
    console.log(channel)
    console.log(notification)

    const userInfo = await prismaCall(() => prisma.user.findMany({
        where: {
            id: {
                in: usersIds,
            },
        },
        select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
        }
    }))

    console.log(userInfo)

    // TODO: SEND MAIL
    // RabbitMQ?
}