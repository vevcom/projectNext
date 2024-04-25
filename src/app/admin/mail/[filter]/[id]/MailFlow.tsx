"use client"

import MailList from "./mailList";
import styles from "./MailFlow.module.scss"
import { MailFlowObject, MailListTypes } from "@/server/mail/Types";
import { destroyAliasMailingListRelationAction } from "@/actions/mail/destroy";

type DestroyFunction = null | ((id: number) => any)

export default async function MailFlow({
    filter,
    id,
    data,
}: {
    filter: MailListTypes,
    id: number,
    data: MailFlowObject,
}) {

    let aliasDestroy: DestroyFunction = null;
    let mailingListDestroy: DestroyFunction = null;
    let groupDestroy: DestroyFunction = null;
    let userDestroy: DestroyFunction = null;
    let addressExternalDestroy: DestroyFunction = null;

    if (filter === "mailingList") {

        aliasDestroy = (aliasId: number) => destroyAliasMailingListRelationAction({
            mailAliasId: aliasId,
            mailingListId: id,
        });
    }

    if (filter === "alias") {
    }

    if (filter === "mailaddressExternal") {
    }

    if (filter === "user") {
    }

    if (filter === "group") {
    }

    return <>
        <div className={styles.mailListContainer}>
            <MailList type="alias" items={data.alias} destroyFunction={aliasDestroy}/>
            <MailList type="mailingList" items={data.mailingList} destroyFunction={mailingListDestroy}/>
            <MailList type="group" items={data.group} destroyFunction={groupDestroy} />
            <MailList type="user" items={data.user} destroyFunction={userDestroy} />
            <MailList type="mailaddressExternal" items={data.mailaddressExternal} destroyFunction={addressExternalDestroy} />
        </div>
    </>
}