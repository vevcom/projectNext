'use server'

import { createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedStudyProgrammeGroup } from './Types'
import { createGroup } from '@/actions/groups/create'
import { CreateStudyProgrammeGroupSchemaType, createStudyProgrammeGroupSchema } from './schema'

export async function createStudyProgrammeGroup(rawData: FormData | CreateStudyProgrammeGroupSchemaType): Promise<ActionReturn<ExpandedStudyProgrammeGroup>> {
    const parse = createStudyProgrammeGroupSchema.safeParse(rawData)
    
    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { name } = parse.data

    const createGroupRes = await createGroup({
        groupType: "STUDY_PROGRAMME_GROUP",
        membershipRenewal: true,
        name,
        data: {}
    })

    if (!createGroupRes.success) {
        return createGroupRes
    }

    return {
        success: true,
        data: createGroupRes.data
    }
}
