
import type { NotificationChannelWithMethods } from "@/server/notifications/Types"
import styles from "./channelSettings.module.scss"
import ChannelMethods from "./channelMethods"
import { NotificationMethod } from "@prisma/client"
import TextInput from "@/app/components/UI/TextInput"
import Button from "@/app/components/UI/Button"
import Select from "@/app/components/UI/Select"
import { useState } from "react"
import Form from "@/app/components/Form/Form"

export default function ChannelSettings({
    channel,
    allChannels,
}: {
    channel: NotificationChannelWithMethods,
    allChannels: NotificationChannelWithMethods[],
}) {
    const methodsAllOf = Object.fromEntries(
        Object.keys(channel.availableMethods).map((method) => [method, false])
    ) as Omit<NotificationMethod, "id">;

    const defaultMethods = channel.defaultMethods ?? methodsAllOf;

    const [ availableMethodsSate, setAvailableMethodsState ] = useState(channel.availableMethods)
    const [ defaultMethodsState, setDefaultMethodsState ] = useState(defaultMethods)

    function findInheretedAvailableMethods(channel: NotificationChannelWithMethods): Omit<NotificationMethod, 'id'> {
        
        if (channel.special === "ROOT") {
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
                    [key, value && channel.availableMethods[key]]
                )
        ) as Omit<NotificationMethod, 'id'>;
    }

    const availableMethodsInherited = findInheretedAvailableMethods(channel);
    const selectOptions = allChannels.map(c => ({ value: c.id, label: c.name }))

    return <Form
        submitText="Lagre"
        className={styles.channelSettings}
    >
        <div className={styles.upperSettings}>
            <div>
                {channel.special != "ROOT" ? <Select label="Forelder" name="parent" options={selectOptions} /> : null }
                {channel.special ? <p>Spesiell: {channel.special}</p> : null}
            </div> 
            <div className={styles.widerSettings}>
                <TextInput label="Navn" name="name" defaultValue={channel.name} />
                <TextInput label="Beskrivelse" name="description" defaultValue={channel.description ?? ""} className={styles.descriptionInput} />
            </div>   
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
}