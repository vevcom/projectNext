'use server'
import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { updateCommittee } from '@/services/groups/committees/update'
import { updateCommitteeValidation } from '@/services/groups/committees/validation'
import type { UpdateCommitteeTypes } from '@/services/groups/committees/validation'


export async function updateCommitteeAction(
    id: number,
    rawdata: FormData | UpdateCommitteeTypes['Type']
) {
    const { status, authorized } = await getUser({
        requiredPermissions: [['COMMITTEE_UPDATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = updateCommitteeValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateCommittee(id, data))
}
