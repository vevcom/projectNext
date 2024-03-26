
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

export default function ChannelSettings({
    channel,
    allChannels,
}: {
    channel: NotificationChannelWithMethods,
    allChannels: NotificationChannelWithMethods[],
}) {
    const methodsAllOf = Object.fromEntries(
        NotificationMethods.map((method) => [method, false])
    ) as Omit<NotificationMethod, "id">;

    const defaultMethods = channel.defaultMethods ?? methodsAllOf;

    const [ availableMethodsSate, setAvailableMethodsState ] = useState(channel.availableMethods)
    const [ defaultMethodsState, setDefaultMethodsState ] = useState(defaultMethods)

    function findInheretedAvailableMethods(channel: NotificationChannelWithMethods): Omit<NotificationMethod, 'id'> {
        
        if (channel.special === "ROOT") {
            if (!channel.availableMethods) {
                throw new Error("Root channel has no available methods")
            }
            return channel.availableMethods;
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

    const availableMethodsInherited = findInheretedAvailableMethods(channel);
    const selectOptions = allChannels.map(c => ({ value: c.id, label: c.name }))

    return <div className={styles.channelSettings}>
        {channel.special ? <p>Spesiell: {channel.special}</p> : null}
        <Form
            action={updateNotificationChannelAction}
            submitText="Lagre"
        >
            <input type="hidden" name="id" value={channel.id} />
            
            <TextInput label="Navn" name="name" defaultValue={channel.name} />
            <div className={styles.widerDiv}>
                <TextInput label="Beskrivelse" name="description" defaultValue={channel.description ?? ""} className={styles.descriptionInput} />
            </div>

            <div className={styles.widerDiv}>
                {channel.special != "ROOT" ?
                    <Select label="Forelder" name="parentId" options={selectOptions} />
                :
                    <input type="hidden" name="parentId" value={channel.parentId} />
                }
            </div>

            <div className={styles.methodContainer}>

                <ChannelMethods
                    formPrefix="availableMethods"
                    title="Tilgjengelige metoder"
                    methods={availableMethodsSate}
                    editable={availableMethodsInherited}
                    onChange={setAvailableMethodsState}
                />
                <ChannelMethods
                    formPrefix="defaultMethods"
                    title="Standard metoder"
                    methods={defaultMethodsState}
                    onChange={setDefaultMethodsState}
                />

            </div>


        </Form>
    </div>
    
}