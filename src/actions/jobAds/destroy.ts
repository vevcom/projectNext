'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { destroyJobAd } from '@/services/jobAds/destroy'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import type { SimpleJobAd } from '@/services/jobAds/Types'
import type { ActionReturn } from '@/actions/Types'

export async function destroyJobAdAction(id: number): Promise<ActionReturn<Omit<SimpleJobAd, 'coverImage'>>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['JOBAD_DESTROY']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => destroyJobAd(id))
}
