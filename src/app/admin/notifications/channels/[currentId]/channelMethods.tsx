"use client"

import type { NotificationMethod } from "@prisma/client"
import Checkbox from "@/app/components/UI/Checkbox"
import styles from "./channelMethods.module.scss"
import { v4 as uuid } from "uuid"
import type { NotificationMethodType } from "src/server/notifications/Types"

export default function ChannelMethods({
    title,
    formPrefix,
    methods,
    editable,
    onChange,
} : {
    title: string,
    formPrefix: NotificationMethodType,
    methods: Omit<NotificationMethod, "id">
    editable?: Omit<NotificationMethod, "id"> & {[key: string]: boolean},
    onChange?: (methods: Omit<NotificationMethod, "id">) => any
}) {

    let state = methods

    function handleChange(this: keyof(Omit<NotificationMethod, "id">), event: React.ChangeEvent<HTMLInputElement>) {
        const newState = {...methods}
        newState[this] = event.target.checked
        if (onChange) onChange(newState)
        state = newState
    }

    return <div className={styles.channelMethods}>
        <h4>{title}</h4>

        {Object.entries(state).map(([key, value]) => {
            const canEdit = !editable || editable[key];
            return <Checkbox
                key={uuid()}
                label={key}
                name={`${formPrefix}_${key}`}
                checked={value}
                disabled={!canEdit}
                onChange={handleChange.bind(key)}
            />
        })}
    </div>
    
}