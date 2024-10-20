'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { readJobAdByNameAndOrder, readJobAdsCurrent } from '@/services/career/jobAds/read'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import type { ExpandedJobAd, SimpleJobAd } from '@/services/career/jobAds/Types'
import type { ActionReturn } from '@/actions/Types'


export async function readJobAdsCurrentAction(): Promise<ActionReturn<SimpleJobAd[]>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['JOBAD_READ']]
    })
    if (!authorized) return createActionError(status)
    return await safeServerCall(() => readJobAdsCurrent())
}

export async function readJobAdAction(idOrName: number | {
    articleName: string
    order: number
}): Promise<ActionReturn<ExpandedJobAd>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['JOBAD_READ']]
    })
    if (!authorized) return createActionError(status)
    return await safeServerCall(() => readJobAdByNameAndOrder(idOrName))
}
