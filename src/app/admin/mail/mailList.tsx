
import { MailListTypes } from "@/server/mail/Types"
import Link from "next/link"
import { v4 as uuid } from "uuid"



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