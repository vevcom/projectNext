'use client'
import styles from './mailListItem.module.scss'
import { MailListTypeArray } from '@/server/mail/Types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuid } from 'uuid'
import type { ActionReturn } from '@/actions/Types'
import type { Group, MailAddressExternal, MailAlias, MailingList } from '@prisma/client'
import type { ViaType } from '@/server/mail/Types'
import type { UserFiltered } from '@/server/users/Types'

type PropType = ({
    type: 'alias',
    item: MailAlias & ViaType,
} | {
    type: 'mailingList',
    item: MailingList & ViaType,
} | {
    type: 'group',
    item: Group & ViaType,
} | {
    type: 'user',
    item: UserFiltered & ViaType,
} | {
    type: 'mailaddressExternal',
    item: MailAddressExternal & ViaType,
}) & {
    destroyFunction?: null | ((id: number) => Promise<ActionReturn<null>>),
}

export default function MailListItem({
    type,
    item,
    destroyFunction,
}: PropType) {
    let displayText = ''

    if (!MailListTypeArray.includes(type)) {
        notFound()
    }

    if (type === 'alias' || type === 'mailaddressExternal') {
        displayText = item.address
    }

    if (type === 'mailingList') {
        displayText = item.name
    }

    if (type === 'user') {
        displayText = `${item.firstname} ${item.lastname}`
    }

    if (type === 'group') {
        displayText = String(item.id)
    }

    const editable = (destroyFunction && !item.via)

    return <li className={`${styles.mailListItem} ${editable ? styles.editable : ''}`}>
        {editable ? <FontAwesomeIcon icon={faTrashCan} onClick={destroyFunction.bind(null, item.id)} /> : null}
        <Link href={`/admin/mail/${type}/${item.id}`}>{displayText}</Link>
        {item.via ? item.via.map(v => <span key={uuid()}>
            ({v.label})
        </span>) : null}
    </li>
}
