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
    mailFlow,
    mailOptions
}: {
    filter: MailListTypes
    id: number
    mailFlow: MailFlowObject,
    mailOptions: MailOptionsType
}) {

    const { jsx, refreshMailFlow } = MailFlow({
        filter: filter,
        id: id,
        mailFlow: mailFlow,
    })

    return <>
        <div className={styles.editContainer}>
            {filter === 'mailingList' ? <EditMailingList
                id={id}
                data={mailFlow}
                mailaliases={mailOptions.alias}
                mailAddressExternal={mailOptions.mailaddressExternal}
                refreshPage={refreshMailFlow}
            /> : null}
            {filter === 'alias' ? <EditMailAlias
                id={id}
                data={mailFlow}
                mailingLists={mailOptions.mailingList}
                refreshPage={refreshMailFlow}
            /> : null}
            {filter === 'mailaddressExternal' ? <EditMailAddressExternal
                id={id}
                data={mailFlow}
                mailingLists={mailOptions.mailingList}
                refreshPage={refreshMailFlow}
            /> : null}
            {filter === 'user' ? <EditUser
                id={id}
                data={mailFlow}
                mailingLists={mailOptions.mailingList}
                refreshPage={refreshMailFlow}
            /> : null}
            {filter === 'group' ? <EditGroup
                id={id}
                data={mailFlow}
                mailingLists={mailOptions.mailingList}
                refreshPage={refreshMailFlow}
            /> : null}
        </div>
        { jsx }
    </>
}