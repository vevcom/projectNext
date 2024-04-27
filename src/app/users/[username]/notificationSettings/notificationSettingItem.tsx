"use client"

import { NotificationBranch } from "./Types"
import { allMethodsOff } from "@/server/notifications/Types"
import UpdateSubscriptionForm from "./updateSubscriptionForm"


export function NotificationSettingItem({
    channel
}: {
    channel: NotificationBranch
}) {

    const methods = channel.subscription?.methods ?? allMethodsOff

    // TODO fetch notifications from subscriptions
    return <div>
        <h4>{channel.name}</h4>
        <p>{channel.description}</p>

        <UpdateSubscriptionForm channel={channel} methods={methods}/>

        <div style={{paddingLeft: "2rem"}}>
            {channel.children.map(c => <NotificationSettingItem channel={c} />)}
        </div>
    </div>
}