import type { ExpandedNotificationChannel } from '@/server/notifications/Types'
import type { UserFiltered } from '@/server/users/Types'
import type { Notification } from '@prisma/client'


export async function dispatchPushNotifications(
    channel: ExpandedNotificationChannel,
    notificaion: Notification,
    users: UserFiltered[]
) {
    console.log('Push')

    console.log(channel)

    console.log(notificaion)

    console.log(users)
}
