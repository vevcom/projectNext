'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createQuote } from '@/services/omegaquotes/create'
import { createOmegaquotesValidation } from '@/services/omegaquotes/validation'
import type { CreateOmegaguotesTypes } from '@/services/omegaquotes/validation'
import type { ActionReturn } from '@/actions/Types'
import type { OmegaQuote } from '@prisma/client'

export async function createQuoteAction(
    rawdata: FormData | CreateOmegaguotesTypes['Type']
): Promise<ActionReturn<OmegaQuote>> {
    const { user, status, authorized } = await getUser({
        requiredPermissions: [['OMEGAQUOTES_WRITE']],
        userRequired: true,
    })
    if (!authorized) return createActionError(status)

    const parse = createOmegaquotesValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    const results = await safeServerCall(() => createQuote(user.id, data))

    return results
}
