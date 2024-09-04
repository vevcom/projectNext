'use server'

import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { createActionError, createZodActionError } from '@/actions/error'
import { updateMailAliasValidation } from '@/services/mail/alias/validation'
import { updateMailAlias } from '@/services/mail/alias/update'
import type { ActionReturn } from '@/actions/Types'
import type { MailAlias } from '@prisma/client'

export async function updateMailAliasAction(rawdata: FormData): Promise<ActionReturn<MailAlias>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILALIAS_UPDATE']],
    })
    if (!authorized) return createActionError(status)

    const parsed = updateMailAliasValidation.typeValidate(rawdata)
    if (!parsed.success) return createZodActionError(parsed)

    return await safeServerCall(() => updateMailAlias(parsed.data))
}
