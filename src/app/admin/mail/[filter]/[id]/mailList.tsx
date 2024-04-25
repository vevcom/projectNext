
import { MailListTypes, ViaType } from "@/server/mail/Types";
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
}

export default function MailList({
    type,
    items,
}: PropType) {

    return <div className={styles.mailList}>
        <h3>{typeDisplayName[type]}</h3>

        <ul>
            { items.map(i => <MailListItem type={type} item={i} key={uuid()} />) }
        </ul>
    </div>
}