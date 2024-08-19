'use client'

import MailList from './mailList'
import styles from './MailFlow.module.scss'
import {
    destroyAliasMailingListRelationAction,
    destroyMailingListExternalRelationAction,
    destroyMailingListGroupRelationAction,
    destroyMailingListUserRelationAction
} from '@/actions/mail/destroy'
import { useUser } from '@/auth/useUser'
import type { ActionReturn } from '@/actions/Types'
import type { MailFlowObject, MailListTypes } from '@/server/mail/Types'
import { useState } from 'react'
import { readMailFlowAction } from '@/actions/mail/read'

type DestroyFunction = null | ((id: number) => Promise<ActionReturn<null>>)

export default function MailFlow({
    filter,
    id,
    mailFlow,
}: {
    filter: MailListTypes,
    id: number,
    mailFlow: MailFlowObject,
}) {

    const [ mailFlowState, setMailFlowSate ] = useState(mailFlow)

    async function refreshMailFlow() {
        const results = await readMailFlowAction(filter, id);
        if (!results.success) return;

        setMailFlowSate(results.data)
    }

    let aliasDestroy: DestroyFunction = null
    let mailingListDestroy: DestroyFunction = null
    let groupDestroy: DestroyFunction = null
    let userDestroy: DestroyFunction = null
    let addressExternalDestroy: DestroyFunction = null

    const uResults = useUser()
    const permissions = uResults.permissions ?? []

    if (filter === 'mailingList') {
        if (permissions.includes('MAILINGLIST_ALIAS_DESTROY')) {
            aliasDestroy = async (mailAliasId: number) => {
                const ret = await destroyAliasMailingListRelationAction({
                    mailingListId: id,
                    mailAliasId,
                })
                return {
                    ...ret,
                    data: null,
                }
            }
        }

        if (permissions.includes('MAILINGLIST_EXTERNAL_ADDRESS_DESTROY')) {
            addressExternalDestroy = async (mailAddressExternalId: number) => {
                const ret = await destroyMailingListExternalRelationAction({
                    mailingListId: id,
                    mailAddressExternalId,
                })
                return {
                    ...ret,
                    data: null,
                }
            }
        }

        if (permissions.includes('MAILINGLIST_USER_DESTROY')) {
            userDestroy = async (userId: number) => {
                const ret = await destroyMailingListUserRelationAction({
                    mailingListId: id,
                    userId,
                })
                return {
                    ...ret,
                    data: null,
                }
            }
        }

        if (permissions.includes('MAILINGLIST_GROUP_DESTROY')) {
            groupDestroy = async (groupId: number) => {
                const ret = await destroyMailingListGroupRelationAction({
                    mailingListId: id,
                    groupId,
                })
                return {
                    ...ret,
                    data: null,
                }
            }
        }
    }

    if (filter === 'alias' && permissions.includes('MAILINGLIST_ALIAS_DESTROY')) {
        mailingListDestroy = async (mailingListId: number) => {
            const ret = await destroyAliasMailingListRelationAction({
                mailAliasId: id,
                mailingListId,
            })
            return {
                ...ret,
                data: null,
            }
        }
    }

    if (filter === 'mailaddressExternal' && permissions.includes('MAILINGLIST_EXTERNAL_ADDRESS_DESTROY')) {
        mailingListDestroy = async (mailingListId: number) => {
            const ret = await destroyMailingListExternalRelationAction({
                mailAddressExternalId: id,
                mailingListId,
            })
            return {
                ...ret,
                data: null,
            }
        }
    }

    if (filter === 'user' && permissions.includes('MAILINGLIST_USER_DESTROY')) {
        mailingListDestroy = async (mailingListId: number) => {
            const ret = await destroyMailingListUserRelationAction({
                userId: id,
                mailingListId,
            })
            return {
                ...ret,
                data: null,
            }
        }
    }

    if (filter === 'group' && permissions.includes('MAILINGLIST_GROUP_DESTROY')) {
        mailingListDestroy = async (mailingListId: number) => {
            const ret = await destroyMailingListGroupRelationAction({
                groupId: id,
                mailingListId,
            })
            return {
                ...ret,
                data: null,
            }
        }
    }

    const ret = <>
        <div className={styles.mailListContainer}>
            <MailList type="alias" items={mailFlowState.alias} filter={filter} destroyFunction={aliasDestroy} refreshPage={refreshMailFlow} />
            <MailList type="mailingList" items={mailFlowState.mailingList} filter={filter} destroyFunction={mailingListDestroy} refreshPage={refreshMailFlow} />
            <MailList type="group" items={mailFlowState.group} filter={filter} destroyFunction={groupDestroy} refreshPage={refreshMailFlow} />
            <MailList type="user" items={mailFlowState.user} filter={filter} destroyFunction={userDestroy} refreshPage={refreshMailFlow} />
            <MailList type="mailaddressExternal" items={mailFlowState.mailaddressExternal} filter={filter} destroyFunction={addressExternalDestroy} refreshPage={refreshMailFlow} />
        </div>
    </>

    return {
        jsx: ret,
        refreshMailFlow
    }
}
