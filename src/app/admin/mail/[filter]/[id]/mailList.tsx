"use client"

import { MailListTypes, ViaType } from "@/server/mail/Types";
import MailListItem from "./mailListItem";
import styles from "./mailList.module.scss"
import { Group, MailAddressExternal, MailAlias, MailingList } from "@prisma/client";
import { UserFiltered } from "@/server/users/Types";
import { v4 as uuid } from 'uuid';
import { useState } from "react";

const typeDisplayName : Record<MailListTypes, string> = {
    "alias": "Alias",
    "mailingList": "Mail lister",
    "group": "Grupper",
    "user": "Brukere",
    "mailaddressExternal": "Eksterne adresser",
}

type PropType = ({
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
}) & {
    destroyFunction?: null | ((id: number) => any),
}

export default function MailList({
    type,
    items,
    destroyFunction
}: PropType) {

    const [itemsState, setItemsState] = useState<typeof items[number][]>(items);

    let destroyFunc = destroyFunction;

    if (destroyFunc) {
        destroyFunc = async (id: number) => {
            if (destroyFunction) {
                const results = await destroyFunction(id)
                if (!results.success) {
                    alert("Kunne ikke fjerne relasjonen")
                    return;
                }

                setItemsState(itemsState.filter(i => i.id != id))
            }
        }
    }


    return <div className={styles.mailList}>
        <h3>{typeDisplayName[type]}</h3>

        <ul>
            { itemsState.map(i => <MailListItem type={type} item={i} key={uuid()} destroyFunction={destroyFunc}/>) }
        </ul>
    </div>
}