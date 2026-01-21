'use server'
import NotificationSettings from './notificationSettings'
import { getProfileForAdmin } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import { readNotificationChannelsAction, readNotificationSubscriptionsAction } from '@/services/notifications/actions'
import type { PropTypes } from '@/app/users/[username]/page'

export default async function Notififcations({ params }: PropTypes) {
    const { profile } = await getProfileForAdmin(await params, 'notifications')
    // TODO: Make mobile friendly

    const [channels, subscriptions] = await Promise.all([
        readNotificationChannelsAction(),
        readNotificationSubscriptionsAction({
            params: {
                userId: profile.user.id
            },
        }),
    ])

    console.log(channels)
    console.log(subscriptions)

    if (!channels.success || !subscriptions.success) {
        throw new Error('Failed to load channels or subscriptions')
    }

    return (
        <div>
            <h2>Notifikasjoner</h2>
            <NotificationSettings user={profile.user} channels={channels.data} subscriptions={subscriptions.data} />
        </div>
    )
}
