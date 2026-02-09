'use server'

import { createZodActionError, safeServerCall } from '@/services/actionError'
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
import type { MailAlias } from '@/prisma-generated-pn-types'

export async function createMailAliasAction(rawdata: FormData):
    Promise<ActionReturn<MailAlias>> {
    const parse = createMailAliasValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => createMailAlias(parse.data))
}

export async function destroyMailAliasAction(id: number): Promise<ActionReturn<MailAlias>> {
    const parse = destoryMailAliasValidation.typeValidate({ id })
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailAlias(parse.data.id))
}

export async function readMailAliasesAction(): Promise<ActionReturn<MailAlias[]>> {
    return safeServerCall(() => readMailAliases())
}

export async function updateMailAliasAction(rawdata: FormData): Promise<ActionReturn<MailAlias>> {
    const parsed = updateMailAliasValidation.typeValidate(rawdata)
    if (!parsed.success) return createZodActionError(parsed)

    return await safeServerCall(() => updateMailAlias(parsed.data))
}
