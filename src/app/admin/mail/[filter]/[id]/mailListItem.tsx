'use client'
import styles from './mailListItem.module.scss'
import { MailListTypeArray } from '@/services/mail/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuid } from 'uuid'
import type { ActionReturn } from '@/services/actionTypes'
import type { MailListTypes, ViaArrayType } from '@/services/mail/types'

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

    const editable = (destroyFunction && via)

    return <li className={`${styles.mailListItem} ${editable ? styles.editable : ''}`}>
        {editable ? <FontAwesomeIcon icon={faTrashCan} onClick={destroyFunction.bind(null, id)} /> : null}
        <Link href={`/admin/mail/${type}/${id}`}>{displayText}</Link>
        {via ? via.map(viaItem => <span key={uuid()}>
            ({viaItem.label})
        </span>) : null}
    </li>
}
