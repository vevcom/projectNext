"use server"
import { readChannels } from '@/server/notifications/read'
import type { ActionReturn } from '@/actions/Types'
import type { NotificationChannelWithMethods } from '@/server/notifications/Types'
import { safeServerCall } from '../safeServerCall'

export async function readNotificaitonChannels(): Promise<ActionReturn<NotificationChannelWithMethods[]>> {
    return await safeServerCall(() => readChannels());
}