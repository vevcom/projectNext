import 'server-only'
import { Notification, NotificationChannel } from '@prisma/client'

export type DispatchMethodFunction = (
    notification: Notification,
    channel: Pick<NotificationChannel, 'id' | 'name'>,
    userIds: number[],
) => Promise<void>