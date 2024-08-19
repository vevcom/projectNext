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

type DestroyFunction = null | ((id: number) => Promise<ActionReturn<null>>)

export default async function MailFlow({
    filter,
    id,
    data,
    refreshPage,
}: {
    filter: MailListTypes,
    id: number,
    data: MailFlowObject,
    refreshPage: () => Promise<void>
}) {
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

    return <>
        <div className={styles.mailListContainer}>
            <MailList type="alias" items={data.alias} filter={filter} destroyFunction={aliasDestroy} refreshPage={refreshPage} />
            <MailList type="mailingList" items={data.mailingList} filter={filter} destroyFunction={mailingListDestroy} refreshPage={refreshPage} />
            <MailList type="group" items={data.group} filter={filter} destroyFunction={groupDestroy} refreshPage={refreshPage} />
            <MailList type="user" items={data.user} filter={filter} destroyFunction={userDestroy} refreshPage={refreshPage} />
            <MailList type="mailaddressExternal" items={data.mailaddressExternal} filter={filter} destroyFunction={addressExternalDestroy} refreshPage={refreshPage} />
        </div>
    </>
}
