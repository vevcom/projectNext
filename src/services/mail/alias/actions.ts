'use server'

import { createActionError, createZodActionError, safeServerCall } from '@/services/actionError'
import { getUser } from '@/auth/getUser'
import { createMailAlias } from '@/services/mail/alias/create'
import { destroyMailAlias } from '@/services/mail/alias/destroy'
import { readMailAliases } from '@/services/mail/alias/read'
import { updateMailAlias } from '@/services/mail/alias/update'
import {
    createMailAliasValidation,
    destoryMailAliasValidation,
    updateMailAliasValidation,
} from '@/services/mail/alias/validation'
import type { ActionReturn } from '@/services/actionTypes'
import type { MailAlias } from '@prisma/client'

export async function createMailAliasAction(rawdata: FormData):
    Promise<ActionReturn<MailAlias>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILALIAS_CREATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = createMailAliasValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => createMailAlias(parse.data))
}

export async function destroyMailAliasAction(id: number): Promise<ActionReturn<MailAlias>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILALIAS_DESTORY']],
    })
    if (!authorized) return createActionError(status)

    const parse = destoryMailAliasValidation.typeValidate({ id })
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailAlias(parse.data.id))
}

export async function readMailAliasesAction(): Promise<ActionReturn<MailAlias[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILALIAS_READ']]
    })
    if (!authorized) return createActionError(status)

    return safeServerCall(() => readMailAliases())
}

export async function updateMailAliasAction(rawdata: FormData): Promise<ActionReturn<MailAlias>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILALIAS_UPDATE']],
    })
    if (!authorized) return createActionError(status)

    const parsed = updateMailAliasValidation.typeValidate(rawdata)
    if (!parsed.success) return createZodActionError(parsed)

    return await safeServerCall(() => updateMailAlias(parsed.data))
}
