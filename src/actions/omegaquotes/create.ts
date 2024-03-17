'use server'
import { omegaquotesSchema } from './schema'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/user'
import { createQuote } from '@/server/omegaquotes/create'
import type { OmegaquotesSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { OmegaQuote } from '@prisma/client'

export async function createQuoteAction(
    rawdata: FormData | OmegaquotesSchemaType
): Promise<ActionReturn<OmegaQuote>> {
    const { user, authorized, status } = await getUser({
        requiredPermissions: ['OMEGAQUOTES_WRITE']
    })
    if (!authorized) return createActionError(status)

    const parse = omegaquotesSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createQuote(user.id, data))
}
