'use client'

import MailListItem from './mailListItem'
import styles from './mailList.module.scss'
import { createActionError } from '@/services/actionError'
import { v4 as uuid } from 'uuid'
import { useState } from 'react'
import type { ActionReturn } from '@/services/actionTypes'
import type { MailListTypes, ViaArrayType } from '@/services/mail/types'
import type { Group, MailAddressExternal, MailAlias, MailingList } from '@prisma/client'
import type { UserFiltered } from '@/services/users/types'

const typeDisplayName: Record<MailListTypes, string> = {
    alias: 'Alias',
    mailingList: 'Mail lister',
    group: 'Grupper',
    user: 'Brukere',
    mailaddressExternal: 'Eksterne adresser',
}

type TypeConversion = {
    alias: (MailAlias & ViaArrayType),
    mailingList: (MailingList & ViaArrayType),
    group: (Group & ViaArrayType),
    user: (UserFiltered & ViaArrayType),
    mailaddressExternal: (MailAddressExternal & ViaArrayType),
}

export default function MailList<T extends MailListTypes>({
    type,
    items,
    destroyFunction
}: {
    type: T,
    items: TypeConversion[T][],
    destroyFunction?: null | ((id: number) => Promise<ActionReturn<null>>),
}) {
    const [itemsState, setItemsState] = useState<TypeConversion[T][]>(items)

    let destroyFunc = destroyFunction

    if (destroyFunc) {
        destroyFunc = async (id: number) => {
            if (destroyFunction) {
                const results = await destroyFunction(id)
                if (!results.success) {
                    alert('Kunne ikke fjerne relasjonen')
                    return results
                }

                setItemsState(itemsState.filter(i => i.id !== id))
            }
            return createActionError('BAD PARAMETERS', 'No destroy function')
        }
    }

    function getDisplayText(item: TypeConversion[T]): string {
        if ((type === 'alias' || type === 'mailaddressExternal') && 'address' in item) {
            return item.address
        }

        if (type === 'mailingList' && 'name' in item) {
            return item.name
        }

        if (type === 'user' && 'firstname' in item && 'lastname' in item) {
            return `${item.firstname} ${item.lastname}`
        }

        if (type === 'group') {
            return String(item.id)
        }

        console.warn('This code should never run. This mens that the argument passed to MailList is invalid.')

        return ''
    }

    return <div className={styles.mailList}>
        <h3>{typeDisplayName[type]}</h3>

        <ul>
            { itemsState.map(i => <MailListItem
                type={type}
                displayText={getDisplayText(i)}
                via={i.via}
                id={i.id}
                key={uuid()}
                destroyFunction={destroyFunc}/>) }
        </ul>
    </div>
}
