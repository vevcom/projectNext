
import { Group, MailAddressExternal, MailAlias, MailingList } from "@prisma/client";
import { UserFiltered } from "@/server/users/Types";
import Link from "next/link";
import { MailListTypeArray, ViaType } from "@/server/mail/Types";
import { notFound } from "next/navigation";

type PropType = {
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
}

export default function MailListItem({
    type,
    item,
}: PropType) {

    let displayText = ""

    if (!MailListTypeArray.includes(type)) {
        notFound()
    }

    if (type == "alias" || type == "mailaddressExternal") {
        displayText = item.address;
    }

    if (type == "mailingList") {
        displayText = item.name;
    }

    if (type === "user") {
        displayText = `${item.firstname} ${item.lastname}`
    }

    if (type === "group") {
        displayText = String(item.id);
    }
    
    return <li>
        <Link href={`/admin/mail/${type}/${item.id}`}>{displayText}</Link>
        {item.via ? item.via.map(v => <span>
            ({v.label})
        </span>) : null}
    </li>
}