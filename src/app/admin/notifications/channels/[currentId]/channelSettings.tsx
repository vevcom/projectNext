
import type { NotificationChannelWithMethods } from "@/server/notifications/Types"
import styles from "./channelSettings.module.scss"
import ChannelMethods from "./channelMethods"
import { NotificationMethod } from "@prisma/client"
import TextInput from "@/app/components/UI/TextInput"
import Select from "@/app/components/UI/Select"
import { useState } from "react"
import Form from "@/app/components/Form/Form"
import { updateNotificationChannelAction } from "@/actions/notifications/update"
import { NotificationMethods } from "@/server/notifications/ConfigVars"
import { on } from "events"

export default function ChannelSettings({
    currentChannel,
    allChannels,
    onUpdate,
}: {
    currentChannel: Number,
    allChannels: NotificationChannelWithMethods[],
    onUpdate?: (channel: NotificationChannelWithMethods) => void
}) {
    const methodsAllOff = Object.fromEntries(
        NotificationMethods.map((method) => [method, false])
    ) as Omit<NotificationMethod, "id">;

    const methodsAllOn = Object.fromEntries(
        NotificationMethods.map((method) => [method, true])
    ) as Omit<NotificationMethod, "id">;
    
    const [ currentChannelState, setCurrentChannel ] = useState({
        ...allChannels.find(c => c.id === currentChannel),
        defaultMethods: allChannels.find(c => c.id === currentChannel)?.defaultMethods ?? methodsAllOff
    })

    if (!currentChannelState) {
        throw new Error("Channel not found")
    }

    function findInheretedAvailableMethods(channel: NotificationChannelWithMethods): Omit<NotificationMethod, 'id'> {
        
        if (channel.special === "ROOT") {
            return methodsAllOn;
        }

        if (channel.parentId === null) {
            console.error(channel)
            throw new Error("channel has no parentid")
        }

        const parent = allChannels.find(c => c.id === channel.parentId);
        if (!parent) {
            throw new Error("Parent not found")
        }

        const methods = findInheretedAvailableMethods(parent)

        return Object.fromEntries(
            Object
                .entries(methods)
                .map(([key, value]) => 
                    [key, value && channel.availableMethods?.[key]]
                )
        ) as Omit<NotificationMethod, 'id'>;
    }

    const selectOptions = allChannels.filter(c => c.id != currentChannelState.id).map(c => ({ value: c.id, label: c.name }))

    return <div className={styles.channelSettings}>
        {currentChannelState.special ? <p>Spesiell: {currentChannelState.special}</p> : null}
        <Form
            action={updateNotificationChannelAction}
            submitText="Lagre"
            successCallback={(data) => {
                if (onUpdate && data) {
                    onUpdate(data)
                }
            }}
        >
            <input type="hidden" name="id" value={currentChannelState.id} />
            
            <TextInput label="Navn" name="name" defaultValue={currentChannelState.name} />
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
                    <Select label="Forelder" name="parentId" options={selectOptions} />
                :
                    <input type="hidden" name="parentId" value={currentChannelState.parentId} />
                }
            </div>

            <div className={styles.methodContainer}>

                <ChannelMethods
                    formPrefix="availableMethods"
                    title="Tilgjengelige metoder"
                    methods={currentChannelState.availableMethods ?? methodsAllOff}
                    onChange={(data) => {
                        setCurrentChannel({
                            ...currentChannelState,
                            availableMethods: data,
                        })
                    }}
                    />
                <ChannelMethods
                    formPrefix="defaultMethods"
                    title="Standard metoder"
                    methods={currentChannelState.defaultMethods ?? methodsAllOff}
                    editable={currentChannelState.availableMethods ?? methodsAllOn}
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
    
}