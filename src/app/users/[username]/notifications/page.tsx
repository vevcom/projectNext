'use server'
import { readNotificationChannelsAction } from "@/actions/notifications/channel/read";
import { readSubscriptionsAction } from "@/actions/notifications/subscription/read";
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import NotificationSettings from "./notificaionSettings";


export default async function Notififcations() {

    const [channels, subscriptions] = await Promise.all([
        readNotificationChannelsAction(),
        readSubscriptionsAction(),
    ])

    if (!channels.success || !subscriptions.success) {
        throw new Error("Failed to load channels or subscriptions")
    }

    return <PageWrapper
        title="Varslinger"
    >
        <NotificationSettings channels={channels.data} subscriptions={subscriptions.data} />
    </PageWrapper>
}