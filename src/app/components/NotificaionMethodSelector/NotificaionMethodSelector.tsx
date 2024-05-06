'use client'

import styles from './NotificaionMethodSelector.module.scss'
import Checkbox from '@/app/components/UI/Checkbox'
import { notificationMethodsDisplayMap } from '@/server/notifications/ConfigVars'
import { v4 as uuid } from 'uuid'
import type { NotificationMethodTypes, NotificationMethod, NotificationMethods } from '@/server/notifications/Types'
import React from 'react'

export default function NotificationMethodSelector({
    title,
    formPrefix,
    methods,
    editable,
    onChange,
}: {
    title?: string,
    formPrefix?: NotificationMethodTypes,
    methods: NotificationMethod
    editable?: NotificationMethod,
    onChange?: (method: NotificationMethod) => void
}) {
    let state = methods

    function handleChange(this: keyof(NotificationMethod), event: React.ChangeEvent<HTMLInputElement>) {
        const newState = { ...methods }
        newState[this] = event.target.checked
        if (onChange) onChange(newState)
        state = newState
    }

    return <div className={styles.channelMethods}>
        {title ?
            <h4>{title}</h4> : null
        }

        {Object.entries(state).map(([key, value]) => {
            const canEdit = !editable || editable[key as NotificationMethods]

            return <Checkbox
                key={uuid()}
                label={notificationMethodsDisplayMap[key as keyof NotificationMethod] ?? key}
                name={formPrefix ? `${formPrefix}_${key}` : key}
                {...(onChange ? { checked: canEdit && value } : { defaultChecked: value })}
                disabled={!canEdit}
                onChange={handleChange.bind(key as keyof NotificationMethod)}
            />
        })}
    </div>
}
