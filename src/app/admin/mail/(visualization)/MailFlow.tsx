"use serve"

import MailList from "./mailList";
import styles from "./MailFlow.module.scss"
import { MailListTypes } from "@/server/mail/Types";
import { readMailFlowAction } from "@/actions/mail/read";



export default async function MailFlow({
    filter,
    id,
}: {
    filter: MailListTypes,
    id: number,
}) {

    const results = await readMailFlowAction("alias", 1);
    console.log(results)
    if (!results.success) {
        throw new Error("Could not fetch mail flow");
    }

    const data = results.data

    return (
        <div className={styles.mailListContainer}>
            <MailList type="alias" items={data.alias} />
            <MailList type="mailingList" items={data.mailingList} />
            <MailList type="group" items={data.group} />
            <MailList type="user" items={data.user} />
            <MailList type="mailaddressExternal" items={data.mailaddressExternal} />
        </div>
    )
}