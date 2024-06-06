'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError, createActionError } from '@/actions/error'
import { createJobAdValidation } from '@/server/jobAds/validation'
import { createJobAd } from '@/server/jobAds/create'
import { getUser } from '@/auth/getUser'
import type { ExpandedJobAd } from '@/server/jobAds/Types'
import type { ActionReturn } from '@/actions/Types'
import type { CreateJobAdTypes } from '@/server/jobAds/validation'

export async function createJobAdAction(
    rawdata: FormData | CreateJobAdTypes['Type']
): Promise<ActionReturn<ExpandedJobAd>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['JOBAD_CREATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = createJobAdValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createJobAd(data))
}
