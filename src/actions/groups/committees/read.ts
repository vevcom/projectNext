'use server'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { readCommittee, readCommitteeArticle, readCommittees } from '@/services/groups/committees/read'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ExpandedCommittee, ExpandedCommitteeWithArticle, ExpandedCommitteeWithCover } from '@/services/groups/committees/Types'
import type { ActionReturn } from '@/actions/Types'
import { ExpandedArticle } from '@/services/cms/articles/Types'

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
): Promise<ActionReturn<ExpandedCommitteeWithCover>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['COMMITTEE_READ']]
    })

    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readCommittee(data))
}

export async function readCommitteeArticleAction(shortName: string): Promise<ActionReturn<ExpandedArticle>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['COMMITTEE_READ']]
    })

    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readCommitteeArticle(shortName))
}
