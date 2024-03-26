"use server"
import { readChannels } from '@/server/notifications/read'
import type { ActionReturn } from '@/actions/Types'
import type { NotificationChannelWithMethods } from '@/server/notifications/Types'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { ServerError } from '@/server/error'

export async function createNotificaitonChannel(): Promise<ActionReturn<void>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'NOTIFICATION_CHANNEL_READ' ]],
        userRequired: true,
    });
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => {
        throw new ServerError('UNKNOWN ERROR', "Not implemented")
    });
}