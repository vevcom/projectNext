'use server'
import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { destroyMailAlias } from '@/server/mail/alias/destroy'
import { destoryMailAliasValidation } from '@/server/mail/alias/validation'
import type { ActionReturn } from '@/actions/Types'
import type { MailAlias } from '@prisma/client'

export async function destroyMailAliasAction(id: number): Promise<ActionReturn<MailAlias>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['MAILALIAS_DESTORY']],
    })
    if (!authorized) return createActionError(status)

    const parse = destoryMailAliasValidation.typeValidate({ id })
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailAlias(parse.data.id))
}
