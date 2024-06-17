'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError, createActionError } from '@/actions/error'
import { updateJobAdValidation } from '@/server/jobAds/validation'
import { updateJobAd } from '@/server/jobAds/update'
import { getUser } from '@/auth/getUser'
import type { UpdateJobAdTypes } from '@/server/jobAds/validation'
import type { SimpleJobAd } from '@/server/jobAds/Types'
import type { ActionReturn } from '@/actions/Types'

export async function updateJobAdAction(
    id: number,
    rawdata: FormData | UpdateJobAdTypes['Type']
): Promise<ActionReturn<Omit<SimpleJobAd, 'coverImage'>>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['JOBAD_UPDATE']]
    })
    if (!authorized) return createActionError(status)
    const parse = updateJobAdValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    return await safeServerCall(() => updateJobAd(id, data))
}
