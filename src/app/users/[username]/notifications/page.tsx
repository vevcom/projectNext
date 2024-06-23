'use server'
import { readNotificationChannelsAction } from "@/actions/notifications/channel/read";
import { readSubscriptionsAction } from "@/actions/notifications/subscription/read";
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import { notificationMethodsDisplayMap } from "@/server/notifications/ConfigVars";
import { notificationMethods } from "@/server/notifications/Types";
import NotificationSettings from "./notificaionSettings";
import styles from "./page.module.scss"


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
        <table>
            <thead>
                <tr>
                    <th>Kanal</th>
                    {notificationMethods.map(method =>
                        <th className={styles.notificationMethodsTH}>{notificationMethodsDisplayMap[method]}</th>
                    )}
                </tr>
            </thead>
            <NotificationSettings channels={channels.data} subscriptions={subscriptions.data} />
        </table>

    </PageWrapper>
}