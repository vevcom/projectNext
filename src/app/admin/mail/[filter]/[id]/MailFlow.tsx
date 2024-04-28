"use client"

import MailList from "./mailList";
import styles from "./MailFlow.module.scss"
import { MailFlowObject, MailListTypes } from "@/server/mail/Types";
import { destroyAliasMailingListRelationAction, destroyMailingListExternalRelationAction, destroyMailingListGroupRelationAction, destroyMailingListUserRelationAction } from "@/actions/mail/destroy";
import { useUser } from "@/auth/useUser";

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

    const uResults = useUser();
    const permissions = uResults.permissions ?? [];

    if (filter === "mailingList") {

        if (permissions.includes("MAILINGLIST_ALIAS_DESTROY")) {
            aliasDestroy = (mailAliasId: number) => destroyAliasMailingListRelationAction({
                mailingListId: id,
                mailAliasId,
            });
        }

        if (permissions.includes("MAILINGLIST_EXTERNAL_ADDRESS_DESTROY")) {
            addressExternalDestroy = (mailAddressExternalId: number) => destroyMailingListExternalRelationAction({
                mailingListId: id,
                mailAddressExternalId,
            })
        }

        if (permissions.includes("MAILINGLIST_USER_DESTROY")) {    
            userDestroy = (userId: number) => destroyMailingListUserRelationAction({
                mailingListId: id,
                userId,
            })
        }

        if (permissions.includes("MAILINGLIST_GROUP_DESTROY")) {    
            groupDestroy = (groupId: number) => destroyMailingListGroupRelationAction({
                mailingListId: id,
                groupId,
            })
        }
    }

    if (filter === "alias" && permissions.includes("MAILINGLIST_ALIAS_DESTROY")) {

        mailingListDestroy = (mailingListId: number) => destroyAliasMailingListRelationAction({
            mailAliasId: id,
            mailingListId,
        })
    }

    if (filter === "mailaddressExternal" && permissions.includes("MAILINGLIST_EXTERNAL_ADDRESS_DESTROY")) {

        mailingListDestroy = (mailingListId: number) => destroyMailingListExternalRelationAction({
            mailAddressExternalId: id,
            mailingListId,
        })
    }

    if (filter === "user" && permissions.includes("MAILINGLIST_USER_DESTROY")) {

        mailingListDestroy = (mailingListId: number) => destroyMailingListUserRelationAction({
            userId: id,
            mailingListId,
        })
    }

    if (filter === "group" && permissions.includes("MAILINGLIST_GROUP_DESTROY")) {

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