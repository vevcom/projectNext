'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { destroyJobAd } from '@/server/jobAds/destroy'
import type { SimpleJobAd } from '@/server/jobAds/Types'
import type { ActionReturn } from '@/actions/Types'

export async function destroyJobAdAction(id: number): Promise<ActionReturn<Omit<SimpleJobAd, 'coverImage'>>> {
    //TODO: check auth
    return await safeServerCall(() => destroyJobAd(id))
}
