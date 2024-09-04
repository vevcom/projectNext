'use server'
import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { destroyMailingList } from '@/services/mail/list/destroy'
import { readMailingListValidation } from '@/services/mail/list/validation'
import type { ActionReturn } from '@/actions/Types'
import type { MailingList } from '@prisma/client'

export async function destroyMailingListAction(id: number): Promise<ActionReturn<MailingList>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILINGLIST_DESTROY']],
    })
    if (!authorized) return createActionError(status)

    const parse = readMailingListValidation.typeValidate({ id })
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailingList(parse.data.id))
}
