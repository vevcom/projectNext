'use server'
import { omegaquotesSchema } from './schema'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/user'
import { createQuote } from '@/server/omegaquotes/create'
import type { OmegaquotesSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { OmegaQuote } from '@prisma/client'

export async function createQuoteAction(
    rawdata: FormData | OmegaquotesSchemaType
): Promise<ActionReturn<OmegaQuote>> {
    const { user, status } = await getUser({
        requiredPermissions: ['OMEGAQUOTES_WRITE']
    })
    if (!user) {
        return createActionError(status)
    }

    const parse = omegaquotesSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await createQuote(user.id, data)
}
