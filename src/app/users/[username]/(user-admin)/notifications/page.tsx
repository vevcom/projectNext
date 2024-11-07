'use server'
import NotificationSettings from './notificationSettings'
import { readNotificationChannelsAction } from '@/actions/notifications/channel/read'
import { readSubscriptionsAction } from '@/actions/notifications/subscription/read'
import { getProfileForAdmin, type PropTypes } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'

export default async function Notififcations(props: PropTypes) {
    const { profile } = await getProfileForAdmin(props, 'notifications')
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
