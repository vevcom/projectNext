'use server'
import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { readMailAddressExternalValidation } from '@/services/mail/mailAddressExternal/validation'
import { destroyMailAddressExternal } from '@/services/mail/mailAddressExternal/destroy'
import type { ActionReturn } from '@/actions/Types'
import type { MailAddressExternal } from '@prisma/client'

export async function destroyMailAddressExternalAction(id: number): Promise<ActionReturn<MailAddressExternal>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILADDRESS_EXTERNAL_DESTROY']],
    })
    if (!authorized) return createActionError(status)

    const parse = readMailAddressExternalValidation.typeValidate({ id })
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailAddressExternal(parse.data.id))
}
