'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import { UpdateJobAdTypes, updateJobAdValidation } from '@/server/jobAds/validation'
import { SimpleJobAd } from '@/server/jobAds/Types'
import { updateJobAd } from '@/server/jobAds/update'

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
