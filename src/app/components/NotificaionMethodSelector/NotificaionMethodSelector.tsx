'use client'

import styles from './NotificaionMethodSelector.module.scss'
import Checkbox from '@/app/components/UI/Checkbox'

import { v4 as uuid } from 'uuid'
import React from 'react'
import type { NotificationMethodTypes, NotificationMethodGeneral, NotificationMethods } from '@/server/notifications/Types'
import NotificationMethodCheckboxes from './NotificationMethodCheckboxes'

export default function NotificationMethodSelector({
    title,
    formPrefix,
    methods,
    editable,
    onChange,
}: {
    title?: string,
    formPrefix?: NotificationMethodTypes,
    methods: NotificationMethodGeneral
    editable?: NotificationMethodGeneral,
    onChange?: (method: NotificationMethodGeneral) => void
}) {

    const checkboxes = NotificationMethodCheckboxes({
        formPrefix,
        label: true,
        methods,
        editable,
        onChange,
    })

    return <div className={styles.channelMethods}>
        {title ?
            <h4>{title}</h4> : null
        }

        {...checkboxes}
    </div>
}
