"use client"
import { Group, MailAddressExternal, MailAlias, MailingList } from "@prisma/client";
import { UserFiltered } from "@/server/users/Types";
import Link from "next/link";
import { MailListTypeArray, ViaType } from "@/server/mail/Types";
import { notFound } from "next/navigation";
import styles from "./mailListItem.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

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
    destroyFunction?: null | ((id: number) => any),
}

export default function MailListItem({
    type,
    item,
    destroyFunction,
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
    
    return <li className={`${styles.mailListItem} ${destroyFunction ? styles.editable : ""}`}>
        {destroyFunction ? <FontAwesomeIcon icon={faTrashCan} onClick={destroyFunction.bind(null, item.id)} /> : null}
        <Link href={`/admin/mail/${type}/${item.id}`}>{displayText}</Link>
        {item.via ? item.via.map(v => <span>
            ({v.label})
        </span>) : null}
    </li>
}