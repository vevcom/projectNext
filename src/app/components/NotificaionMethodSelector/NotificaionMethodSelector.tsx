"use client"

import type { NotificationMethod } from "@prisma/client"
import Checkbox from "@/app/components/UI/Checkbox"
import styles from "./NotificaionMethodSelector.module.scss"
import { v4 as uuid } from "uuid"
import type { NotificationMethodType } from "src/server/notifications/Types"
import { NotificationMethodDisplayName } from "@/server/notifications/ConfigVars"

export default function NotificationMethodSelector({
    title,
    formPrefix,
    methods,
    editable,
    onChange,
} : {
    title?: string,
    formPrefix?: NotificationMethodType,
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
        {title ? 
            <h4>{title}</h4> : null
        }

        {Object.entries(state).map(([key, value]) => {
            const canEdit = !editable || editable[key];

            return <Checkbox
                key={uuid()}
                label={NotificationMethodDisplayName(key as keyof(Omit<NotificationMethod, "id">))}
                name={formPrefix ? `${formPrefix}_${key}` : key}
                {...(onChange ? {checked: canEdit && value} : {defaultChecked: value})}
                disabled={!canEdit}
                onChange={handleChange.bind(key as keyof(Omit<NotificationMethod, "id">))}
            />
        })}
    </div>
    
}