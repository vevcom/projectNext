'use server'

import { makeAction } from '@/services/serverAction'
import { createActionError, createZodActionError, safeServerCall } from '@/services/actionError'
import { getUser } from '@/auth/session/getUser'
import { createCommittee } from '@/services/groups/committees/create'
import { committeeOperations } from '@/services/groups/committees/operations'
import { updateCommittee } from '@/services/groups/committees/update'
import { createCommitteeValidation, updateCommitteeValidation } from '@/services/groups/committees/validation'
import type { ExpandedCommittee } from '@/services/groups/committees/types'
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

export const readAllCommitteesAction = makeAction(committeeOperations.readAll)
export const readCommitteeAction = makeAction(committeeOperations.read)
export const readCommitteeArticleAction = makeAction(committeeOperations.readArticle)
export const readCommitteeParagraphAction = makeAction(committeeOperations.readParagraph)
export const readCommitteeMembersAction = makeAction(committeeOperations.readMembers)

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
