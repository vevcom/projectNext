"use client"

import type { NotificationChannelWithMethods } from "@/server/notifications/Types"
import styles from "./channelSettings.module.scss"
import NotificationMethodSelector from "@/components/NotificaionMethodSelector/NotificaionMethodSelector"
import TextInput from "@/app/components/UI/TextInput"
import Select from "@/app/components/UI/Select"
import { useState } from "react"
import Form from "@/app/components/Form/Form"
import { updateNotificationChannelAction } from "@/actions/notifications/update"
import { NotificationMethodsAllOff, NotificationMethodsAllOn } from "@/server/notifications/ConfigVars"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper"

export default function ChannelSettings({
    currentChannel,
    channels,
}: {
    currentChannel: NotificationChannelWithMethods,
    channels: NotificationChannelWithMethods[],
}) {
    
    const [ currentChannelState, setCurrentChannel ] = useState({
        ...currentChannel,
        defaultMethods: currentChannel?.defaultMethods ?? NotificationMethodsAllOff
    })

    let selectOptions = channels.filter(c => c.id != currentChannelState.id)
    // Remove chrildren of the current channel
    let channelIDS = new Set(selectOptions.map(c => c.id))
    while (true) {
        const lengthBeforeReduction = channelIDS.size
        for (let i = selectOptions.length - 1; i >= 0; i--) {
            if (!channelIDS.has(selectOptions[i].parentId)) {
                channelIDS.delete(selectOptions[i].id)
                selectOptions.splice(i, 1)
            }
        }
        if (lengthBeforeReduction === channelIDS.size) {
            break;
        }
    }

    return <PageWrapper
        title={currentChannelState.name}
    >
        <div className={styles.channelSettings}>
            {currentChannelState.special ? <p>Spesiell: {currentChannelState.special}</p> : null}
            <Form
                action={updateNotificationChannelAction}
                submitText="Lagre"
            >
                <input type="hidden" name="id" value={currentChannelState.id} />
                
                <TextInput label="Navn" name="name" defaultValue={currentChannelState.name} onChange={(e) => {
                    const value = e.target.value
                    setCurrentChannel({
                        ...currentChannelState,
                        name: value,
                    })
                }} />
                <div className={styles.widerDiv}>
                    <TextInput
                        label="Beskrivelse"
                        name="description"
                        defaultValue={currentChannelState.description ?? ""}
                        className={styles.descriptionInput}
                    />
                </div>

                <div className={styles.widerDiv}>
                    {currentChannelState.special != "ROOT" ?
                        <Select
                            label="Forelder"
                            name="parentId"
                            options={selectOptions.map(c => ({ value: c.id, label: c.name }))}
                            defaultValue={currentChannelState.parentId}
                        />
                    :
                        <input type="hidden" name="parentId" value={currentChannelState.parentId} />
                    }
                </div>

                <div className={styles.methodContainer}>

                    <NotificationMethodSelector
                        formPrefix="availableMethods"
                        title="Tilgjengelige metoder"
                        methods={currentChannelState.availableMethods ?? NotificationMethodsAllOff}
                        onChange={(data) => {
                            setCurrentChannel({
                                ...currentChannelState,
                                availableMethods: data,
                            })
                        }}
                        />
                    <NotificationMethodSelector
                        formPrefix="defaultMethods"
                        title="Standard metoder"
                        methods={currentChannelState.defaultMethods ?? NotificationMethodsAllOff}
                        editable={currentChannelState.availableMethods ?? NotificationMethodsAllOn}
                        onChange={(data) => {
                            setCurrentChannel({
                                ...currentChannelState,
                                defaultMethods: data,
                            })
                        }}
                    />

                </div>


            </Form>
        </div>
    </PageWrapper>
    
}