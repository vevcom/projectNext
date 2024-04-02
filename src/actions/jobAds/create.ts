'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createJobAdValidation } from '@/server/jobAds/validation'
import type { ActionReturn } from '@/actions/Types'
import type { CreateJobAdTypes } from '@/server/jobAds/validation'
import { ExpandedJobAd } from '@/server/jobAds/Types'
import { createJobAd } from '@/server/jobAds/create'

export async function createJobAdAction(
    rawdata: FormData | CreateJobAdTypes['Type']
): Promise<ActionReturn<ExpandedJobAd>> {
    //TODO: check for can create news permission
    const parse = createJobAdValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createJobAd(data))
}