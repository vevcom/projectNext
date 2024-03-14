'use server'

import 'server-only'
import { createGroup } from '@/server/groups/create'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedstudyProgramme } from './Types'
import { SpecificGroupCreateInput } from '@/server/groups/Types'

export async function createStudyProgramme({
    name,
    details,
}: SpecificGroupCreateInput<'STUDY_PROGRAMME'>): Promise<ActionReturn<ExpandedstudyProgramme>> {
    const createGroupRes = await createGroup('STUDY_PROGRAMME', {
        membershipRenewal: false,
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
