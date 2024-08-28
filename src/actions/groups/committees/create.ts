'use server'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createCommittee } from '@/services/groups/committees/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createCommitteeValidation } from '@/services/groups/committees/validation'
import type { ExpandedCommittee } from '@/services/groups/committees/Types'
import type { ActionReturn } from '@/actions/Types'
import type { CreateCommitteeTypes } from '@/services/groups/committees/validation'

export async function createCommitteeAction(
    rawData: FormData | CreateCommitteeTypes['Type']
): Promise<ActionReturn<ExpandedCommittee>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['COMMITTEE_CREATE']],
        shouldRedirect: false,
    })

    if (!authorized) return createActionError(status)

    const parse = createCommitteeValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => createCommittee(parse.data))
}
