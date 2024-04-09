'use server'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { readCommittee, readCommittees } from '@/server/groups/committees/read'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ExpandedCommittee } from '@/server/groups/committees/Types'
import type { ActionReturn } from '@/actions/Types'

/**
 * Reads all committees
 */
export async function readCommitteesAction(): Promise<ActionReturn<ExpandedCommittee[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['COMMITTEE_READ']]
    })

    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readCommittees())
}

export async function readCommitteeAction(
    data: {
        shortName: string
    },
): Promise<ActionReturn<ExpandedCommittee>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['COMMITTEE_READ']]
    })

    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readCommittee(data))
}
