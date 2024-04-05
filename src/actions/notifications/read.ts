"use server"
import { readChannels, readUserSubscriptions } from '@/server/notifications/read'
import type { ActionReturn } from '@/actions/Types'
import type { NotificationChannelSubscription, NotificationChannelWithMethods, NotificationSubscriptionWithMethods } from '@/server/notifications/Types'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'

export async function readNotificaitonChannels(): Promise<ActionReturn<NotificationChannelWithMethods[]>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'NOTIFICATION_CHANNEL_READ' ]],
        userRequired: true,
    });
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readChannels());
}

export async function readNotificaitonSubscriptionsAction():
Promise<
    ActionReturn<
        NotificationChannelSubscription[]
    >
>
{
    const { authorized, status, user } = await getUser({
        requiredPermissions: [[ 'NOTIFICATION_CHANNEL_READ' ]],
        userRequired: true,
    });
    if (!authorized) return createActionError(status)

    return await safeServerCall(async () => {
        const [channels, subscriptions] = await Promise.all([
            readChannels(),
            readUserSubscriptions(user.id),
        ])

        return channels.map(c => {
            const subscription = subscriptions.find(s => s.channelId == c.id)
            return {
                ...c,
                subscription,
            }
        })
    })
}