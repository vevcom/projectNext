'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import {
    createAliasMailingListValidation,
    createMailingListExternalValidation,
    createMailingListGroupValidation,
    createMailingListUserValidation
} from '@/server/mail/validation'
import {
    createAliasMailingListRelation,
    createMailingListExternalRelation,
    createMailingListGroupRelation,
    createMailingListUserRelation
} from '@/server/mail/create'
import type { ActionReturn } from '@/actions/Types'
import type {
    MailAliasMailingList,
    MailingListGroup,
    MailingListMailAddressExternal,
    MailingListUser
} from '@prisma/client'

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
