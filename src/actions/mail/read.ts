'use server'

import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { readMailTraversal } from '@/services/mail/read'
import { readMailAliases } from '@/services/mail/alias/read'
import { readMailingLists } from '@/services/mail/list/read'
import { readMailAddressExternal } from '@/services/mail/mailAddressExternal/read'
import { getUser } from '@/auth/getUser'
import type { UserContactInfoFiltered } from '@/services/users/Types'
import type { MailListTypes } from '@/services/mail/Types'
import type { MailingList, MailAlias, MailAddressExternal } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'


export async function readMailFlowAction(filter: MailListTypes, id: number) {
    const { authorized, status } = await getUser({
        requiredPermissions: [
            ['MAILINGLIST_READ'],
            ['MAILALIAS_READ'],
            ['MAILADDRESS_EXTERNAL_READ'],
            ['GROUP_READ'],
        ],
    })

    if (!authorized) return createActionError(status)

    return safeServerCall(() => readMailTraversal({
        filter,
        id,
    }))
}

export async function readMailOptions(): Promise<ActionReturn<{
    alias: MailAlias[],
    mailingList: MailingList[],
    mailaddressExternal: MailAddressExternal[],
    users: UserContactInfoFiltered[],
}>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [
            ['MAILINGLIST_READ'],
            ['MAILALIAS_READ'],
            ['MAILADDRESS_EXTERNAL_READ'],
        ],
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(async () => {
        const results = await Promise.all([
            readMailAliases(),
            readMailingLists(),
            readMailAddressExternal(),
        ])

        return {
            alias: results[0],
            mailingList: results[1],
            mailaddressExternal: results[2],
            users: []
        }
    })
}
