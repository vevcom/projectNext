'use server'

import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { readMailAliases } from '@/server/mail/alias/read'
import { getUser } from '@/auth/getUser'
import type { ActionReturn } from '@/actions/Types'
import type { MailAlias } from '@prisma/client'

export async function readMailAliasesAction(): Promise<ActionReturn<MailAlias[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILALIAS_READ']]
    })
    if (!authorized) return createActionError(status)

    return safeServerCall(() => readMailAliases())
}
