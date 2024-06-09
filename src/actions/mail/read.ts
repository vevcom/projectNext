'use server'

import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { readMailTraversal } from '@/server/mail/read'
import { readAllMailAliases } from '@/server/mail/alias/read'
import { readAllMailingLists } from '@/server/mail/list/read'
import { readAllMailAddressExternal } from '@/server/mail/mailAddressExternal/read'
import { getUser } from '@/auth/getUser'
import type { UserFiltered } from '@/server/users/Types'
import type { MailListTypes } from '@/server/mail/Types'
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

export async function readAllMailOptions(): Promise<ActionReturn<{
    alias: MailAlias[],
    mailingList: MailingList[],
    mailaddressExternal: MailAddressExternal[],
    users: UserFiltered[],
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
            readAllMailAliases(),
            readAllMailingLists(),
            readAllMailAddressExternal(),
        ])

        return {
            alias: results[0],
            mailingList: results[1],
            mailaddressExternal: results[2],
            users: []
        }
    })
}
