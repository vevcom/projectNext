'use server'
import { createZodActionError, safeServerCall } from '@/services/actionError'
import { createMailAddressExternal } from '@/services/mail/mailAddressExternal/create'
import { destroyMailAddressExternal } from '@/services/mail/mailAddressExternal/destroy'
import { updateMailAddressExternal } from '@/services/mail/mailAddressExternal/update'
import {
    createMailAddressExternalValidation,
    readMailAddressExternalValidation,
    updateMailAddressExternalValidation,
} from '@/services/mail/mailAddressExternal/validation'
import type { ActionReturn } from '@/services/actionTypes'
import type { MailAddressExternal } from '@/prisma-generated-pn-types'

export async function createMailAddressExternalAction(rawdata: FormData):
    Promise<ActionReturn<MailAddressExternal>> {
    const parse = createMailAddressExternalValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => createMailAddressExternal(parse.data))
}

export async function destroyMailAddressExternalAction(id: number): Promise<ActionReturn<MailAddressExternal>> {
    const parse = readMailAddressExternalValidation.typeValidate({ id })
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailAddressExternal(parse.data.id))
}

export async function updateMailAddressExternalAction(data: FormData):
Promise<ActionReturn<MailAddressExternal>> {
    const parse = updateMailAddressExternalValidation.typeValidate(data)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => updateMailAddressExternal(parse.data))
}
