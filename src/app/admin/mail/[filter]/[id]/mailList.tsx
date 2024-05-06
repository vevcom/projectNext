'use client'

import MailListItem from './mailListItem'
import styles from './mailList.module.scss'
import { v4 as uuid } from 'uuid'
import { useState } from 'react'
import type { ActionReturn } from '@/actions/Types'
import type { MailListTypes, ViaType } from '@/server/mail/Types'
import type { Group, MailAddressExternal, MailAlias, MailingList } from '@prisma/client'
import type { UserFiltered } from '@/server/users/Types'

const typeDisplayName: Record<MailListTypes, string> = {
    alias: 'Alias',
    mailingList: 'Mail lister',
    group: 'Grupper',
    user: 'Brukere',
    mailaddressExternal: 'Eksterne adresser',
}

type PropType = ({
    type: 'alias',
    items: (MailAlias & ViaType)[],
} | {
    type: 'mailingList',
    items: (MailingList & ViaType)[],
} | {
    type: 'group',
    items: (Group & ViaType)[],
} | {
    type: 'user',
    items: (UserFiltered & ViaType)[],
} | {
    type: 'mailaddressExternal',
    items: (MailAddressExternal & ViaType)[],
}) & {
    destroyFunction?: null | ((id: number) => Promise<ActionReturn<null>>),
}

export default function MailList({
    type,
    items,
    destroyFunction
}: PropType) {
    const [itemsState, setItemsState] = useState<typeof items[number][]>(items)

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
            return {
                success: false,
                errorCode: 'BAD PARAMETERS',
                error: [{ message: 'Destory function is not set' }],
            }
        }
    }


    return <div className={styles.mailList}>
        <h3>{typeDisplayName[type]}</h3>

        <ul>
            { itemsState.map(i => <MailListItem type={type} item={i} key={uuid()} destroyFunction={destroyFunc}/>) }
        </ul>
    </div>
}
