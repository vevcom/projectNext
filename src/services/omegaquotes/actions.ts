'use server'

import { createActionError, createZodActionError, safeServerCall } from '@/services/actionError'
import { getUser } from '@/auth/session/getUser'
import { createQuote } from '@/services/omegaquotes/create'
import { readQuotesPage } from '@/services/omegaquotes/read'
import { createOmegaquotesValidation } from '@/services/omegaquotes/validation'
import type { OmegaquoteCursor, OmegaquoteFiltered } from '@/services/omegaquotes/types'
import type { ReadPageInput } from '@/lib/paging/types'
import type { ActionReturn } from '@/services/actionTypes'
import type { CreateOmegaguotesTypes } from '@/services/omegaquotes/validation'
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

export async function readQuotesPageAction<const PageSize extends number>(
    readPageInput: ReadPageInput<PageSize, OmegaquoteCursor>
): Promise<ActionReturn<OmegaquoteFiltered[]>> {
    //TODO:  REFACTOR when new permission system is working
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMEGAQUOTES_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readQuotesPage(readPageInput))
}
