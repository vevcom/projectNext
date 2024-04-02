import 'server-only'
import type { Notification, NotificationChannel } from '@prisma/client'

export async function dispatchEmailNotifications(
    notification: Notification,
    channel: Pick<NotificationChannel, 'id' | 'name'>,
    usersIds: number[]
): Promise<void> {
    console.log("SEND EMAIL")
    console.log(usersIds)
    console.log(channel)
    console.log(notification)

}