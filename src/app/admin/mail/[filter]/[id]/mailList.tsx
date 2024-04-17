
import { MailListTypes } from "@/server/mail/Types";
import MailListItem from "./mailListItem";
import styles from "./mailList.module.scss"
import { Group, MailAddressExternal, MailAlias, MailingList } from "@prisma/client";
import { UserFiltered } from "@/server/users/Types";
import { v4 as uuid } from 'uuid';

const typeDisplayName : Record<MailListTypes, string> = {
    "alias": "Alias",
    "mailingList": "Mail lister",
    "group": "Grupper",
    "user": "Brukere",
    "mailaddressExternal": "Eksterne adresser",
}

type PropType = {
    type: 'alias',
    items: MailAlias[],
} | {
    type: 'mailingList',
    items: MailingList[],
} | {
    type: 'group',
    items: Group[],
} | {
    type: 'user',
    items: UserFiltered[],
} | {
    type: 'mailaddressExternal',
    items: MailAddressExternal[],
}

export default function MailList({
    type,
    items,
}: PropType) {

    return <div className={styles.mailList}>
        <h3>{typeDisplayName[type]}</h3>

        <ul>
            { items.map(i => <MailListItem item={i} key={uuid()} />) }
        </ul>
    </div>
}