'use client'

import MailListItem from './mailListItem'
import styles from './mailList.module.scss'
import { v4 as uuid } from 'uuid'
import { useState } from 'react'
import type { ActionReturn } from '@/actions/Types'
import type { MailListTypes, ViaArrayType } from '@/server/mail/Types'
import { typeDisplayName } from './ConfigVars'
import { TypeConversion } from './Types'
import { getDisplayText } from './common'

export default function MailList<T extends MailListTypes>({
    type,
    items,
    destroyFunction,
    refreshPage,
    filter
}: {
    type: T,
    items: (TypeConversion[T] & ViaArrayType)[],
    destroyFunction?: null | ((id: number) => Promise<ActionReturn<null>>),
    refreshPage: () => Promise<void>,
    filter: MailListTypes
}) {
    const active = filter === type

    let destroyFunc = destroyFunction

    if (destroyFunc) {
        destroyFunc = async (id: number) => {
            if (destroyFunction) {
                const results = await destroyFunction(id)
                if (!results.success) {
                    alert('Kunne ikke fjerne relasjonen')
                    return results
                }

                refreshPage()
            }
            return {
                success: false,
                errorCode: 'BAD PARAMETERS',
                error: [{ message: 'Destory function is not set' }],
            }
        }
    }

    return <div className={`${styles.mailList} ${active ? styles.active : ''}`}>
        <h3>{typeDisplayName[type]}</h3>

        <ul>
            { items.map(i => <MailListItem
                type={type}
                displayText={getDisplayText(type, i)}
                via={i.via}
                id={i.id}
                key={uuid()}
                destroyFunction={destroyFunc}/>) }
        </ul>
    </div>
}
