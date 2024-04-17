"use server"

import MailList from "./mailList";
import styles from "./MailFlow.module.scss"
import { MailFlowObject, MailListTypes } from "@/server/mail/Types";
import EditMailAlias from "./(editComponent)/mailAlias";



export default async function MailFlow({
    filter,
    id,
    data,
}: {
    filter: MailListTypes,
    id: number,
    data: MailFlowObject
}) {

    return <>
        <div className={styles.editContainer}>
            {filter == "alias" ? <EditMailAlias id={id} data={data} /> : null}
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