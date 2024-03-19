
import type { NotificationChannelWithMethods } from "@/server/notifications/Types"
import styles from "./channelSettings.module.scss"
import ChannelMethods from "./channelMethods"
import { NotificationMethod } from "@prisma/client"
import TextInput from "@/app/components/UI/TextInput"
import Button from "@/app/components/UI/Button"
import Select from "@/app/components/UI/Select"
import { useState } from "react"

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

    const selectOptions = allChannels.map(c => ({ value: c.id, label: c.name }))

    return <div className={styles.channelSettings}>
        <div className={styles.upperSettings}>
            <div>
                <Button type="submit" className={styles.saveButton}>Lagre</Button>
                {channel.special != "ROOT" ? <Select label="Forelder" name="parent" options={selectOptions} /> : null }
            </div> 
            <div className={styles.widerSettings}>
                <TextInput label="Navn" name="name" defaultValue={channel.name} />
                <TextInput label="Beskrivelse" name="description" defaultValue={channel.description ?? ""} className={styles.descriptionInput} />
            </div>   
        </div>

        <div className={styles.methodContainer}>
            <ChannelMethods formPrefix="availableMethods" title="Tilgjengelige metoder" methods={channel.availableMethods} />
            <ChannelMethods formPrefix="defaultMethods" title="Standard metoder" methods={defaultMethods} />
        </div>

    </div>
}