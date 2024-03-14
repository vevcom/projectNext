import 'server-only'
import { createGroup } from '@/server/groups/create'
import type { SpecificGroupCreateInput } from '@/server/groups/Types'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedStudyProgramme } from './Types'

type CreateStudyProgrammeArgs = SpecificGroupCreateInput<'STUDY_PROGRAMME'>

export async function createStudyProgramme({
    name,
    details,
}: CreateStudyProgrammeArgs): Promise<ActionReturn<ExpandedStudyProgramme>> {
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
