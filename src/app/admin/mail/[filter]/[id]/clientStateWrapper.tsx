"use client"

import { MailOptionsType } from "@/actions/mail/Types"
import { MailFlowObject, MailListTypes } from "@/server/mail/Types"
import { useState } from "react"
import MailFlow from "./MailFlow"
import styles from "./clientStateWrapper.module.scss"
import EditMailingList from "./(editComponents)/mailingList"
import EditMailAlias from "./(editComponents)/mailAlias"
import EditMailAddressExternal from "./(editComponents)/mailAddressExternal"
import EditUser from "./(editComponents)/user"
import EditGroup from "./(editComponents)/group"
import { readMailFlowAction } from "@/actions/mail/read"


export default function ClientStateWrapper({
    filter,
    id,
    mailFlowObject,
    mailOptions
}: {
    filter: MailListTypes
    id: number
    mailFlowObject: MailFlowObject,
    mailOptions: MailOptionsType
}) {

    const [ mailFlowState, setMailFlowSate ] = useState(mailFlowObject)

    async function refreshMailFlow() {
        const results = await readMailFlowAction(filter, id);
        if (!results.success) return;

        setMailFlowSate(results.data)
    }


    return <>
        <div className={styles.editContainer}>
            {filter === 'mailingList' ? <EditMailingList
                id={id}
                data={mailFlowState}
                mailaliases={mailOptions.alias}
                mailAddressExternal={mailOptions.mailaddressExternal}
                refreshPage={refreshMailFlow}
            /> : null}
            {filter === 'alias' ? <EditMailAlias
                id={id}
                data={mailFlowState}
                mailingLists={mailOptions.mailingList}
                refreshPage={refreshMailFlow}
            /> : null}
            {filter === 'mailaddressExternal' ? <EditMailAddressExternal
                id={id}
                data={mailFlowState}
                mailingLists={mailOptions.mailingList}
                refreshPage={refreshMailFlow}
            /> : null}
            {filter === 'user' ? <EditUser
                id={id}
                data={mailFlowState}
                mailingLists={mailOptions.mailingList}
                refreshPage={refreshMailFlow}
            /> : null}
            {filter === 'group' ? <EditGroup
                id={id}
                data={mailFlowState}
                mailingLists={mailOptions.mailingList}
                refreshPage={refreshMailFlow}
            /> : null}
        </div>
        <MailFlow filter={filter} id={id} data={mailFlowState} refreshPage={refreshMailFlow} />
    </>
}