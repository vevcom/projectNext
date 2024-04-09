'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { updateJobAdValidation } from '@/server/jobAds/validation'
import { updateJobAd } from '@/server/jobAds/update'
import type { UpdateJobAdTypes } from '@/server/jobAds/validation'
import type { SimpleJobAd } from '@/server/jobAds/Types'
import type { ActionReturn } from '@/actions/Types'

export async function updateJobAdAction(
    id: number,
    rawdata: FormData | UpdateJobAdTypes['Type']
): Promise<ActionReturn<Omit<SimpleJobAd, 'coverImage'>>> {
    //TODO: auth
    const parse = updateJobAdValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    return await safeServerCall(() => updateJobAd(id, data))
}
