'use client'
import styles from './mailListItem.module.scss'
import { MailListTypeArray } from '@/services/mail/Types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuid } from 'uuid'
import type { ActionReturn } from '@/actions/Types'
import type { MailListTypes, ViaArrayType } from '@/services/mail/Types'

export default function MailListItem({
    type,
    id,
    displayText,
    destroyFunction,
    via,
}: {
    type: MailListTypes,
    id: number,
    displayText: string,
    destroyFunction?: null | ((identity: number) => Promise<ActionReturn<null>>),
} & ViaArrayType) {
    if (!MailListTypeArray.includes(type)) {
        notFound()
    }

    const editable = (destroyFunction && !via)

    return <li className={`${styles.mailListItem} ${editable ? styles.editable : ''}`}>
        {editable ? <FontAwesomeIcon icon={faTrashCan} onClick={destroyFunction.bind(null, id)} /> : null}
        <Link href={`/admin/mail/${type}/${id}`}>{displayText}</Link>
        {via ? via.map(v => <span key={uuid()}>
            ({v.label})
        </span>) : null}
    </li>
}
