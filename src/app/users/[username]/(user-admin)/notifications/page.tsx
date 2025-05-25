'use server'
import NotificationSettings from './notificationSettings'
import { readNotificationChannelsAction } from '@/actions/notifications/channel/read'
import { readSubscriptionsAction } from '@/actions/notifications/subscription/read'
import { getProfileForAdmin } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import type { PropTypes } from '@/app/users/[username]/page'

export default async function Notififcations({ params }: PropTypes) {
    const { profile } = await getProfileForAdmin(await params, 'notifications')
    // TODO: Make mobile friendly

    const [channels, subscriptions] = await Promise.all([
        readNotificationChannelsAction(),
        readSubscriptionsAction(),
    ])

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
