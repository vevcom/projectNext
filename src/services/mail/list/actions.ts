'use server'

import { createActionError, createZodActionError, safeServerCall } from '@/services/actionError'
import { getUser } from '@/auth/session/getUser'
import { createMailingList } from '@/services/mail/list/create'
import { destroyMailingList } from '@/services/mail/list/destroy'
import { updateMailingList } from '@/services/mail/list/update'
import {
    createMailingListValidation,
    readMailingListValidation,
    updateMailingListValidation
} from '@/services/mail/list/validation'
import type { ActionReturn } from '@/services/actionTypes'
import type { MailingList } from '@prisma/client'

export async function createMailingListAction(rawdata: FormData):
    Promise<ActionReturn<MailingList>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILINGLIST_CREATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = createMailingListValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => createMailingList(parse.data))
}

export async function destroyMailingListAction(id: number): Promise<ActionReturn<MailingList>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILINGLIST_DESTROY']],
    })
    if (!authorized) return createActionError(status)

    const parse = readMailingListValidation.typeValidate({ id })
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailingList(parse.data.id))
}

export async function updateMailingListAction(data: FormData):
Promise<ActionReturn<MailingList>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILINGLIST_UPDATE']],
    })
    if (!authorized) return createActionError(status)

    const parse = updateMailingListValidation.typeValidate(data)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => updateMailingList(parse.data))
}
