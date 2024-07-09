'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { updateMailingList } from '@/server/mail/list/update'
import { updateMailingListValidation } from '@/server/mail/list/validation'
import type { ActionReturn } from '@/actions/Types'
import type { MailingList } from '@prisma/client'


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
