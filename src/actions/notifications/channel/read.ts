'use server'

import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { readNotificationChannels } from '@/services/notifications/channel/read'
import type { ExpandedNotificationChannel } from '@/services/notifications/Types'
import type { ActionReturn } from '@/actions/Types'


export async function readNotificationChannelsAction():
    Promise<ActionReturn<ExpandedNotificationChannel[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['NOTIFICATION_CHANNEL_READ']],
        userRequired: false,
    })

    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readNotificationChannels())
}
