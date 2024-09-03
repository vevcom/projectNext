'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { readQuotesPage } from '@/services/omegaquotes/read'
import type { ActionReturn } from '@/actions/Types'
import type { ReadPageInput } from '@/services/paging/Types'
import type { OmegaquoteCursor, OmegaquoteFiltered } from '@/services/omegaquotes/Types'

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
