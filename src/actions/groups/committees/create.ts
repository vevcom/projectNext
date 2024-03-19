'use server'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createCommittee } from '@/server/groups/committees/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createCommitteeValidation } from '@/server/groups/committees/schema'
import type { ExpandedCommittee } from '@/server/groups/committees/Types'
import type { ActionReturn } from '@/actions/Types'
import type { CreateCommitteeType } from '@/server/groups/committees/schema'

export async function createCommitteeAction(
    rawData: FormData | CreateCommitteeType
): Promise<ActionReturn<ExpandedCommittee>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['COMMITTEE_CREATE']],
        shouldRedirect: false,
        userRequired: false,
    })

    if (!authorized) return createActionError(status)

    const parse = createCommitteeValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => createCommittee(parse.data))
}
