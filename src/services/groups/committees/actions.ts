'use server'

import { action } from '@/services/action'
import { createActionError, createZodActionError, safeServerCall } from '@/services/actionError'
import { getUser } from '@/auth/getUser'
import { createCommittee } from '@/services/groups/committees/create'
import { CommitteeMethods } from '@/services/groups/committees/methods'
import { updateCommittee } from '@/services/groups/committees/update'
import { createCommitteeValidation, updateCommitteeValidation } from '@/services/groups/committees/validation'
import type { ExpandedCommittee } from '@/services/groups/committees/Types'
import type { ActionReturn } from '@/services/actionTypes'
import type { CreateCommitteeTypes, UpdateCommitteeTypes } from '@/services/groups/committees/validation'

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

export const readCommitteesAction = action(CommitteeMethods.readCommittees)
export const readCommitteeAction = action(CommitteeMethods.readCommittee)
export const readCommitteeArticleAction = action(CommitteeMethods.readCommitteArticle)
export const readCommitteeParagraphAction = action(CommitteeMethods.readCommitteeParagraph)
export const readCommitteeMembersAction = action(CommitteeMethods.readCommitteeMembers)

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
