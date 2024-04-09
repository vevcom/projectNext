'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { readJobAdByNameAndOrder, readJobAdsCurrent } from '@/server/jobAds/read'
import type { ExpandedJobAd, SimpleJobAd } from '@/server/jobAds/Types'
import type { ActionReturn } from '@/actions/Types'


export async function readJobAdsCurrentAction(): Promise<ActionReturn<SimpleJobAd[]>> {
    //TODO: only read news with right visibility
    return await safeServerCall(() => readJobAdsCurrent())
}

export async function readJobAdAction(idOrName: number | {
    articleName: string
    order: number
}): Promise<ActionReturn<ExpandedJobAd>> {
    return await safeServerCall(() => readJobAdByNameAndOrder(idOrName))
}
