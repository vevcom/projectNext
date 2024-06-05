'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createJobAdValidation } from '@/server/jobAds/validation'
import { createJobAd } from '@/server/jobAds/create'
import type { ExpandedJobAd } from '@/server/jobAds/Types'
import type { ActionReturn } from '@/actions/Types'
import type { CreateJobAdTypes } from '@/server/jobAds/validation'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'

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
