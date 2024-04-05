"use client"
import styles from "./notificaionSettingsView.module.scss"
import { NotificationMethodsAllOff } from "@/server/notifications/ConfigVars"
import { SubscriptionThreeObject } from "./Types"
import NotificationMethodSelector from "@/app/components/NotificaionMethodSelector/NotificaionMethodSelector"
import Form from "@/app/components/Form/Form"
import { useState } from "react"
import { updateOwnSubscription } from "@/actions/notifications/update"

export default function NotificationSettingsView({
    channel,
    collapsed = true,
}: {
    channel: SubscriptionThreeObject,
    collapsed?: boolean,
}) {

    const [ childrenCollaped, setChildrenCollapsed ] = useState(collapsed);

    return (
        <div className={styles.notificaionSettingView}>
            <h3>{channel.name}</h3>
            {channel.description}

            <Form
                submitText="Oppdater"
                action={updateOwnSubscription}

            >
                <input type="hidden" name="channelId" value={channel.id}/>
                <input type="hidden" name="id" value={channel.subscription?.id}/>

                <NotificationMethodSelector
                    methods={channel.subscription?.methods ?? NotificationMethodsAllOff}
                    editable={channel.availableMethods}
                />
            </Form>


            {channel.children.length ?
                <div className={styles.childrenContainer}>

                    <h4
                        onClick={() => setChildrenCollapsed(!childrenCollaped)}
                    >
                        Underkategorier
                    </h4>

                    <div className={`${styles.collapsable} ${childrenCollaped ? styles.collapseHidden : ""}`}>
                        {channel.children.map(c => {
                            return <NotificationSettingsView channel={c}/>
                        })}
                    </div>
                </div>
            : null }
        </div>
    )
}