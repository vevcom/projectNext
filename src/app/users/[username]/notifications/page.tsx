'use server'
import NotificationSettings from './notificationSettings'
import { readNotificationChannelsAction } from '@/actions/notifications/channel/read'
import { readSubscriptionsAction } from '@/actions/notifications/subscription/read'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'


export default async function Notififcations() {
    // TODO: Make mobile friendly

    const [channels, subscriptions] = await Promise.all([
        readNotificationChannelsAction(),
        readSubscriptionsAction(),
    ])

    if (!channels.success || !subscriptions.success) {
        throw new Error('Failed to load channels or subscriptions')
    }

    return <PageWrapper
        title="Varslinger"
    >
        <NotificationSettings channels={channels.data} subscriptions={subscriptions.data} />
    </PageWrapper>
}
