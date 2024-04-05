
import { NotificationMethodsAllOff } from "@/server/notifications/ConfigVars"
import { SubscriptionThreeObject } from "./Types"
import NotificationMethodSelector from "@/app/components/NotificaionMethodSelector/NotificaionMethodSelector"

export default function NotificationSettingsView({
    channel,
}: {
    channel: SubscriptionThreeObject
}) {

    return (
        <div>
            <h3>{channel.name}</h3>
            {channel.description}

            <NotificationMethodSelector
                methods={channel.subscription?.methods ?? NotificationMethodsAllOff}
                editable={channel.availableMethods}
            />

            <div style={{marginLeft: "2rem"}}>
                {channel.children.map(c => {
                    return <NotificationSettingsView channel={c}/>
                })}
            </div>
        </div>
    )
}