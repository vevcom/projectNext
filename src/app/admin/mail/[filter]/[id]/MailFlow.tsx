"use client"

import MailList from "./mailList";
import styles from "./MailFlow.module.scss"
import { MailFlowObject, MailListTypes } from "@/server/mail/Types";
import { destroyAliasMailingListRelationAction, destroyMailingListExternalRelationAction, destroyMailingListGroupRelationAction, destroyMailingListUserRelationAction } from "@/actions/mail/destroy";

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

        aliasDestroy = (mailAliasId: number) => destroyAliasMailingListRelationAction({
            mailingListId: id,
            mailAliasId,
        });

        addressExternalDestroy = (mailAddressExternalId: number) => destroyMailingListExternalRelationAction({
            mailingListId: id,
            mailAddressExternalId,
        })

        userDestroy = (userId: number) => destroyMailingListUserRelationAction({
            mailingListId: id,
            userId,
        })

        groupDestroy = (groupId: number) => destroyMailingListGroupRelationAction({
            mailingListId: id,
            groupId,
        })
    }

    if (filter === "alias") {

        mailingListDestroy = (mailingListId: number) => destroyAliasMailingListRelationAction({
            mailAliasId: id,
            mailingListId,
        })
    }

    if (filter === "mailaddressExternal") {

        mailingListDestroy = (mailingListId: number) => destroyMailingListExternalRelationAction({
            mailAddressExternalId: id,
            mailingListId,
        })
    }

    if (filter === "user") {

        mailingListDestroy = (mailingListId: number) => destroyMailingListUserRelationAction({
            userId: id,
            mailingListId,
        })
    }

    if (filter === "group") {

        mailingListDestroy = (mailingListId: number) => destroyMailingListGroupRelationAction({
            groupId: id,
            mailingListId,
        })
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