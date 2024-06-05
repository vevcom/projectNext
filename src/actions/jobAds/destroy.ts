'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { destroyJobAd } from '@/server/jobAds/destroy'
import type { SimpleJobAd } from '@/server/jobAds/Types'
import type { ActionReturn } from '@/actions/Types'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'

export async function destroyJobAdAction(id: number): Promise<ActionReturn<Omit<SimpleJobAd, 'coverImage'>>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['JOBAD_DESTROY']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => destroyJobAd(id))
}
