'use server'

import { createCommitteeActionSchema } from './schema'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createCommittee } from '@/server/groups/committees/create'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ExpandedCommittee } from '@/server/groups/committees/Types'
import type { ActionReturn } from '@/actions/Types'
import type { CreateCommitteeActionSchemaType } from './schema'

export async function createCommitteeAction(
    rawData: FormData | CreateCommitteeActionSchemaType
): Promise<ActionReturn<ExpandedCommittee>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['COMMITTEE_CREATE']]
    })

    if (!authorized) return createActionError(status)

    const parse = createCommitteeActionSchema.safeParse(rawData)

    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => createCommittee(parse.data))
}
