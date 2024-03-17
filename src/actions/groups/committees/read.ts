'use server'

import { readCommitteeActionSchema } from './schema'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/user'
import { readCommittee, readCommittees } from '@/server/groups/committees/read'
import type { ReadCommitteeActionSchemaType } from './schema'
import type { ExpandedCommittee } from '@/server/groups/committees/Types'
import type { ActionReturn } from '@/actions/Types'

/**
 * Reads all committees
 */
export async function readCommitteesAction(): Promise<ActionReturn<ExpandedCommittee[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: ['COMMITTEE_READ']
    })

    if (!authorized) return createActionError(status)

    return readCommittees()
}

export async function readCommitteeAction(
    rawData: FormData | ReadCommitteeActionSchemaType
): Promise<ActionReturn<ExpandedCommittee>> {
    const { authorized, status } = await getUser({
        requiredPermissions: ['COMMITTEE_READ']
    })

    if (!authorized) return createActionError(status)

    const parse = readCommitteeActionSchema.safeParse(rawData)

    if (!parse.success) return createZodActionError(parse)

    return readCommittee(parse.data)
}
