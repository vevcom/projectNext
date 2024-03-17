'use server'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/user'
import { readQuotesPage } from '@/server/omegaquotes/read'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { OmegaquoteFiltered } from '@/server/omegaquotes/Types'
import { safeServerCall } from '../safeServerCall'

export async function readQuotesPageAction<const PageSize extends number>(
    readPageInput: ReadPageInput<PageSize>
): Promise<ActionReturn<OmegaquoteFiltered[]>> {
    //TODO:  REFACTOR when new permission system is working
    const { status, authorized } = await getUser({
        requiredPermissions: ['OMEGAQUOTES_READ']
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readQuotesPage(readPageInput))
}
