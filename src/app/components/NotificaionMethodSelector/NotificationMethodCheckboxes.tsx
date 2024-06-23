'use client'
import { NotificationMethod, NotificationMethodTypes, allMethodsOff } from "@/server/notifications/Types";
import { v4 as uuid } from 'uuid'
import { useState } from "react";
import Checkbox from "@/components/UI/Checkbox";
import { notificationMethodsDisplayMap } from '@/server/notifications/ConfigVars'


export default function NotificationMethodCheckboxes({
    formPrefix,
    methods,
    label,
    editable,
    onChange,
}: {
    formPrefix?: NotificationMethodTypes,
    methods: NotificationMethod
    label?: boolean
    editable?: NotificationMethod,
    onChange?: (method: NotificationMethod) => void
}) {
    const [ state, setState ] = useState(methods)

    const displayLabel = label ?? false

    function handleChange(this: keyof(NotificationMethod), event: React.ChangeEvent<HTMLInputElement>) {
        const newState = { ...state }
        newState[this] = event.target.checked
        if (onChange) onChange(newState)
        setState(newState)
    }

    return Object.entries(state).map(([_key, value]) => {
        const key = _key as keyof NotificationMethod

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