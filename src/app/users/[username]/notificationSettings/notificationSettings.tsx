import { readNotificaitonSubscriptionsAction } from "@/actions/notifications/read"
import NotificationSettingsView from "./notificationSettingsView";
import { NotificationChannelSubscription } from "@/server/notifications/Types";
import { SubscriptionThreeObject } from "./Types";


export default async function NotificationSettings() {

    const channels = await readNotificaitonSubscriptionsAction();
    if (!channels.success) {
        console.error(channels)
        throw Error("Could not read Subscriptions")
    }

    const rootChannel = channels.data.find(c => c.special === "ROOT")

    if (!rootChannel) {
        throw Error("Could not find Root channel")
    }

    const subscriptionThree: SubscriptionThreeObject = {
        ...rootChannel,
        children: []
    }

    function findChildren(obj: SubscriptionThreeObject, chnls: NotificationChannelSubscription[], depth = 10) {
        console.log(obj)

        if (depth < 0) {
            throw Error("Too deep in search, probably a loop in the notificaion channels.")
        }

        obj.children = chnls.filter(c => (c.parentId == obj.id && c.special !== "ROOT")).map(c => ({
            ...c,
            children: [],
        })).map(c => findChildren(c, chnls, depth - 1))

        return obj
    }

    findChildren(subscriptionThree, channels.data)

    return (
        <NotificationSettingsView channel={subscriptionThree} />
    )
}