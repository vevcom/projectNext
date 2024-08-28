'use server'

import { createMailingListValidation } from '@/services/mail/list/validation'
import { createZodActionError, createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { createMailingList } from '@/services/mail/list/create'
import { getUser } from '@/auth/getUser'
import type { ActionReturn } from '@/actions//Types'
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

