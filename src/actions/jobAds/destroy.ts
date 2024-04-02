'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ActionReturn } from '@/actions/Types'
import { SimpleJobAd } from '@/server/jobAds/Types'
import { destroyJobAd } from '@/server/jobAds/destroy'

export async function destroyJobAdAction(id: number): Promise<ActionReturn<Omit<SimpleJobAd, 'coverImage'>>> {
    //TODO: check auth
    return await safeServerCall(() => destroyJobAd(id))
}
