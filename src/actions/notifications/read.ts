"user server"
import { readChannels as readNotificationChannels } from '@/server/notifications/read'
import type { ActionReturn } from '@/actions/Types'
import type { NotificationChannelWithMethods } from '@/server/notifications/Types'


export async function readChannels(): Promise<ActionReturn<NotificationChannelWithMethods[]>> {
    return await readNotificationChannels();
}