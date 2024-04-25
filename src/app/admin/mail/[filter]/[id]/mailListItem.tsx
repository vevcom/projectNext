
import { Group, MailAddressExternal, MailAlias, MailingList } from "@prisma/client";
import { UserFiltered } from "@/server/users/Types";
import Link from "next/link";
import { MailListTypeArray } from "@/server/mail/Types";
import { notFound } from "next/navigation";

export type PropType = {
    type: 'alias',
    item: MailAlias,
} | {
    type: 'mailingList',
    item: MailingList,
} | {
    type: 'group',
    item: Group,
} | {
    type: 'user',
    item: UserFiltered,
} | {
    type: 'mailaddressExternal',
    item: MailAddressExternal,
};

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
    
    return <li><Link href={`/admin/mail/${type}/${item.id}`}>{displayText}</Link></li>
}