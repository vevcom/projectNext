import 'server-only'
import { createGroup } from '@/server/groups/create'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedInterestGroup } from './Types'
import type { SpecificGroupCreateInput } from '@/server/groups/Types'

type CreateInterestGroupArgs = SpecificGroupCreateInput<'INTEREST_GROUP'>

export async function createInterestGroup({
    name,
    details,
}: CreateInterestGroupArgs): Promise<ActionReturn<ExpandedInterestGroup>> {
    const createGroupRes = await createGroup('INTEREST_GROUP', {
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
