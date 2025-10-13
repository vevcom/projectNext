'use client'
import Checkbox from '@/components/UI/Checkbox'
import { notificationMethodsDisplayMap } from '@/services/notifications/constants'
import { v4 as uuid } from 'uuid'
import React, { useState } from 'react'
import type { NotificationMethodGeneral, NotificationMethodTypes } from '@/services/notifications/types'

export default function NotificationMethodCheckboxes({
    formPrefix,
    methods,
    label,
    editable,
    onChange,
}: {
    formPrefix?: NotificationMethodTypes,
    methods: NotificationMethodGeneral
    label?: boolean
    editable?: NotificationMethodGeneral,
    onChange?: (method: NotificationMethodGeneral) => void
}) {
    const [state, setState] = useState(methods)

    function handleChange(this: keyof (NotificationMethodGeneral), event: React.ChangeEvent<HTMLInputElement>) {
        const newState = { ...state }
        newState[this] = event.target.checked
        if (onChange) onChange(newState)
        setState(newState)
    }

    return Object.entries(state).map(([_key, value]) => {
        const key = _key as keyof NotificationMethodGeneral

        const canEdit = !editable || editable[key]

        return <Checkbox
            key={uuid()}
            name={formPrefix ? `${formPrefix}_${key}` : key}
            {...(onChange ? { checked: canEdit && value } : { defaultChecked: value })}
            {...(label ? { label: notificationMethodsDisplayMap[key] } : {})}
            disabled={!canEdit}
            onChange={handleChange.bind(key)}
        />
    })
}
