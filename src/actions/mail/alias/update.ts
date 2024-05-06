'use server'

import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { createActionError, createZodActionError } from '@/actions/error'
import { updateMailAliasValidation } from '@/server/mail/alias/validation'
import { updateMailAlias } from '@/server/mail/alias/update'
import type { ActionReturn } from '@/actions/Types'
import type { MailAlias } from '@prisma/client'

export async function updateMailAliasAction(rawdata: FormData): Promise<ActionReturn<MailAlias>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILALIAS_UPDATE']],
    })
    if (!authorized) return createActionError(status)

    const parsed_data = updateMailAliasValidation.typeValidate(rawdata)
    if (!parsed_data.success) return createZodActionError(parsed_data)

    return await safeServerCall(() => updateMailAlias(parsed_data.data))
}
