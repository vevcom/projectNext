
import Link from 'next/link'
import { v4 as uuid } from 'uuid'
import type { MailListTypes } from '@/services/mail/Types'


export default function MailList({
    items,
    type,
}: {
    items: {
        id: string | number,
        label: string,
    }[],
    type: MailListTypes,
}) {
    return <ul>
        {items.map(item => <li key={uuid()}><Link href={`mail/${type}/${item.id}`}>{ item.label }</Link></li>)}
    </ul>
}
