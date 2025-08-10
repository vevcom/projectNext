'use server'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import {
    readCommittee,
    readCommitteeArticle,
    readCommitteeMembers,
    readCommitteeParagraph,
    readCommittees
} from '@/services/groups/committees/read'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ExpandedArticle } from '@/services/cms/articles/Types'
import type { ExpandedCommittee, ExpandedCommitteeWithCover } from '@/services/groups/committees/Types'
import type { ActionReturn } from '@/actions/Types'
import type { CmsParagraph } from '@prisma/client'

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

export async function readCommitteeParagraphAction(shortName: string): Promise<ActionReturn<CmsParagraph>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['COMMITTEE_READ']]
    })

    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readCommitteeParagraph(shortName))
}

// TODO: Convert to ServiceMethod
export async function readCommitteeMembersAction(shortName: string) {
    return await safeServerCall(() => readCommitteeMembers(shortName))
}
