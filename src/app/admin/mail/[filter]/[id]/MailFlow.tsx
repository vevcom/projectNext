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
import type { MailFlowObject, MailListTypes } from '@/server/mail/Types'

type DestroyFunction = null | ((id: number) => Promise<void>)

export default async function MailFlow({
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
                await destroyAliasMailingListRelationAction({
                    mailingListId: id,
                    mailAliasId,
                })
            }
        }

        if (permissions.includes('MAILINGLIST_EXTERNAL_ADDRESS_DESTROY')) {
            addressExternalDestroy = async (mailAddressExternalId: number) => {
                await destroyMailingListExternalRelationAction({
                    mailingListId: id,
                    mailAddressExternalId,
                })
            }
        }

        if (permissions.includes('MAILINGLIST_USER_DESTROY')) {
            userDestroy = async (userId: number) => {
                await destroyMailingListUserRelationAction({
                    mailingListId: id,
                    userId,
                })
            }
        }

        if (permissions.includes('MAILINGLIST_GROUP_DESTROY')) {
            groupDestroy = async (groupId: number) => {
                await destroyMailingListGroupRelationAction({
                    mailingListId: id,
                    groupId,
                })
            }
        }
    }

    if (filter === 'alias' && permissions.includes('MAILINGLIST_ALIAS_DESTROY')) {
        mailingListDestroy = async (mailingListId: number) => {
            await destroyAliasMailingListRelationAction({
                mailAliasId: id,
                mailingListId,
            })
        }
    }

    if (filter === 'mailaddressExternal' && permissions.includes('MAILINGLIST_EXTERNAL_ADDRESS_DESTROY')) {
        mailingListDestroy = async (mailingListId: number) => {
            await destroyMailingListExternalRelationAction({
                mailAddressExternalId: id,
                mailingListId,
            })
        }
    }

    if (filter === 'user' && permissions.includes('MAILINGLIST_USER_DESTROY')) {
        mailingListDestroy = async (mailingListId: number) => {
            await destroyMailingListUserRelationAction({
                userId: id,
                mailingListId,
            })
        }
    }

    if (filter === 'group' && permissions.includes('MAILINGLIST_GROUP_DESTROY')) {
        mailingListDestroy = async (mailingListId: number) => {
            await destroyMailingListGroupRelationAction({
                groupId: id,
                mailingListId,
            })
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
