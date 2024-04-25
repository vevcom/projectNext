"use server"

import MailList from "./mailList";
import styles from "./MailFlow.module.scss"
import { MailFlowObject, MailListTypes } from "@/server/mail/Types";
import EditMailAlias from "./(editComponents)/mailAlias";
import { MailAddressExternal, MailAlias, MailingList } from "@prisma/client";
import EditMailingList from "./(editComponents)/mailingList";
import EditMailAddressExternal from "./(editComponents)/mailAddressExternal";
import { UserFiltered } from "@/server/users/Types";
import EditUser from "./(editComponents)/user";
import EditGroup from "./(editComponents)/group";



export default async function MailFlow({
    filter,
    id,
    data,
    mailOptions,
}: {
    filter: MailListTypes,
    id: number,
    data: MailFlowObject,
    mailOptions: {
        alias: MailAlias[],
        mailingList: MailingList[],
        mailaddressExternal: MailAddressExternal[],
        users: UserFiltered[],
    },
}) {

    console.log(data);

    return <>
        <div className={styles.editContainer}>
            {filter === "alias" ? <EditMailAlias
                id={id}
                data={data}
                mailingLists={mailOptions.mailingList}
            /> : null}
            {filter === "mailingList" ? <EditMailingList
                id={id}
                data={data}
                mailaliases={mailOptions.alias}
                mailAddressExternal={mailOptions.mailaddressExternal}
                users={mailOptions.users}
            /> : null}
            {filter === "mailaddressExternal" ? <EditMailAddressExternal
                id={id}
                data={data}
                mailingLists={mailOptions.mailingList}
            /> : null}
            {filter === "user" ? <EditUser
                id={id}
                data={data}
                mailingLists={mailOptions.mailingList}
            /> : null}
            {filter === "group" ? <EditGroup
                id={id}
                data={data}
                mailingLists={mailOptions.mailingList}
            /> : null}

        </div>
        <div className={styles.mailListContainer}>
            <MailList type="alias" items={data.alias} />
            <MailList type="mailingList" items={data.mailingList} />
            <MailList type="group" items={data.group} />
            <MailList type="user" items={data.user} />
            <MailList type="mailaddressExternal" items={data.mailaddressExternal} />
        </div>
    </>
}