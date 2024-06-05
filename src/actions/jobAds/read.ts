'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { readJobAdByNameAndOrder, readJobAdsCurrent } from '@/server/jobAds/read'
import type { ExpandedJobAd, SimpleJobAd } from '@/server/jobAds/Types'
import type { ActionReturn } from '@/actions/Types'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'


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
