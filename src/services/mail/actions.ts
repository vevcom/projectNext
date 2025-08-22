'use server'

import { createActionError, createZodActionError, safeServerCall } from '@/services/actionError'
import { getUser } from '@/auth/getUser'
import { readMailAliases } from '@/services/mail/alias/read'
import {
    createAliasMailingListRelation,
    createMailingListExternalRelation,
    createMailingListGroupRelation,
    createMailingListUserRelation } from '@/services/mail/create'
import {
    destroyAliasMailingListRelation,
    destroyMailingListExternalRelation,
    destroyMailingListGroupRelation,
    destroyMailingListUserRelation } from '@/services/mail/destroy'
import { readMailingLists } from '@/services/mail/list/read'
import { readMailAddressExternal } from '@/services/mail/mailAddressExternal/read'
import { readMailTraversal } from '@/services/mail/read'
import {
    createAliasMailingListValidation,
    createMailingListExternalValidation,
    createMailingListGroupValidation,
    createMailingListUserValidation } from '@/services/mail/validation'
import type { MailListTypes } from '@/services/mail/Types'
import type { ActionReturn } from '@/services/actionTypes'
import type { CreateAliasMailingListType,
    CreateMailingListExternalType,
    CreateMailingListGroupType,
    CreateMailingListUserType } from '@/services/mail/validation'
import type { UserFiltered } from '@/services/users/Types'
import type { MailAliasMailingList,
    MailingListGroup,
    MailingListMailAddressExternal,
    MailingListUser, MailAddressExternal, MailAlias, MailingList } from '@prisma/client'

export async function createAliasMailingListRelationAction(formdata: FormData):
    Promise<ActionReturn<MailAliasMailingList>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILINGLIST_ALIAS_CREATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = createAliasMailingListValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => createAliasMailingListRelation(parse.data))
}

export async function createMailingListExternalRelationAction(formdata: FormData):
    Promise<ActionReturn<MailingListMailAddressExternal>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILINGLIST_EXTERNAL_ADDRESS_CREATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = createMailingListExternalValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => createMailingListExternalRelation(parse.data))
}

export async function createMailingListUserRelationAction(formdata: FormData):
    Promise<ActionReturn<MailingListUser>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILINGLIST_USER_CREATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = createMailingListUserValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => createMailingListUserRelation(parse.data))
}

export async function createMailingListGroupRelationAction(formdata: FormData):
    Promise<ActionReturn<MailingListGroup>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILINGLIST_GROUP_CREATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = createMailingListGroupValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => createMailingListGroupRelation(parse.data))
}

export async function destroyAliasMailingListRelationAction(formdata: FormData | CreateAliasMailingListType['Type']):
    Promise<ActionReturn<MailAliasMailingList>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILINGLIST_ALIAS_DESTROY']]
    })
    if (!authorized) return createActionError(status)

    const parse = createAliasMailingListValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyAliasMailingListRelation(parse.data))
}

export async function destroyMailingListExternalRelationAction(formdata: FormData | CreateMailingListExternalType['Type']):
    Promise<ActionReturn<MailingListMailAddressExternal>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILINGLIST_EXTERNAL_ADDRESS_DESTROY']]
    })
    if (!authorized) return createActionError(status)

    const parse = createMailingListExternalValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailingListExternalRelation(parse.data))
}

export async function destroyMailingListUserRelationAction(formdata: FormData | CreateMailingListUserType['Type']):
    Promise<ActionReturn<MailingListUser>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILINGLIST_USER_DESTROY']],
    })
    if (!authorized) return createActionError(status)

    const parse = createMailingListUserValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailingListUserRelation(parse.data))
}

export async function destroyMailingListGroupRelationAction(formdata: FormData | CreateMailingListGroupType['Type']):
    Promise<ActionReturn<MailingListGroup>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILINGLIST_GROUP_DESTROY']]
    })
    if (!authorized) return createActionError(status)

    const parse = createMailingListGroupValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailingListGroupRelation(parse.data))
}

export async function readMailFlowAction(filter: MailListTypes, id: number) {
    const { authorized, status } = await getUser({
        requiredPermissions: [
            ['MAILINGLIST_READ'],
            ['MAILALIAS_READ'],
            ['MAILADDRESS_EXTERNAL_READ'],
            ['GROUP_READ'],
        ],
    })

    if (!authorized) return createActionError(status)

    return safeServerCall(() => readMailTraversal({
        filter,
        id,
    }))
}

export async function readMailOptions(): Promise<ActionReturn<{
    alias: MailAlias[],
    mailingList: MailingList[],
    mailaddressExternal: MailAddressExternal[],
    users: UserFiltered[],
}>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [
            ['MAILINGLIST_READ'],
            ['MAILALIAS_READ'],
            ['MAILADDRESS_EXTERNAL_READ'],
        ],
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(async () => {
        const results = await Promise.all([
            readMailAliases(),
            readMailingLists(),
            readMailAddressExternal(),
        ])

        return {
            alias: results[0],
            mailingList: results[1],
            mailaddressExternal: results[2],
            users: []
        }
    })
}
