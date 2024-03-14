import 'server-only'
import { createGroup } from '@/server/groups/create'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedCommittee } from './Types'
import type { SpecificGroupCreateInput } from '@/server/groups/Types'

type CreateCommitteArgs = SpecificGroupCreateInput<'COMMITTEE'>

export async function createCommittee({
    name,
    details,
}: CreateCommitteArgs): Promise<ActionReturn<ExpandedCommittee>> {
    const createGroupRes = await createGroup('COMMITTEE', {
        membershipRenewal: true,
        name,
        details,
    })

    if (!createGroupRes.success) {
        return createGroupRes
    }

    return {
        success: true,
        data: createGroupRes.data
    }
}
