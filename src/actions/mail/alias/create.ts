'use server'

import { createMailAliasValidation } from '@/services/mail/alias/validation'
import { createZodActionError, createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { createMailAlias } from '@/services/mail/alias/create'
import { getUser } from '@/auth/getUser'
import type { ActionReturn } from '@/actions//Types'
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

