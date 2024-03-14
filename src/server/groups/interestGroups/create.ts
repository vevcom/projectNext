'use server'

import 'server-only'
import { createGroup } from '@/server/groups/create'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedInterestGroup } from './Types'
import { SpecificGroupCreateInput } from '../Types'

export async function createInterestGroup({
    name,
    details,
}: SpecificGroupCreateInput<'INTEREST_GROUP'>): Promise<ActionReturn<ExpandedInterestGroup>> {
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
