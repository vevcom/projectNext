'use client'

import MailList from './mailList'
import styles from './MailFlow.module.scss'
import { useUser } from '@/auth/session/useUser'
import {
    destroyAliasMailingListRelationAction,
    destroyMailingListExternalRelationAction,
    destroyMailingListGroupRelationAction,
    destroyMailingListUserRelationAction
} from '@/services/mail/actions'
import type { ActionReturn } from '@/services/actionTypes'
import type { MailFlowObject, MailListTypes } from '@/services/mail/types'

type DestroyFunction = null | ((id: number) => Promise<ActionReturn<null>>)

export default function MailFlow({
    filter,
    id,
    data,
}: {
    filter: MailListTypes,
    id: number,
    data: MailFlowObject,
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
            <MailList type="alias" items={data.alias} destroyFunction={aliasDestroy}/>
            <MailList type="mailingList" items={data.mailingList} destroyFunction={mailingListDestroy}/>
            <MailList type="group" items={data.group} destroyFunction={groupDestroy} />
            <MailList type="user" items={data.user} destroyFunction={userDestroy} />
            <MailList type="mailaddressExternal" items={data.mailaddressExternal} destroyFunction={addressExternalDestroy} />
        </div>
    </>
}
