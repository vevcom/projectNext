'use server'

import { createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedCommitte } from './Types'
import { createGroup } from '@/actions/groups/create'
import { CreateCommitteeSchemaType, createCommitteeSchema } from './schema'

export async function createCommittee(rawData: FormData | CreateCommitteeSchemaType): Promise<ActionReturn<ExpandedCommitte>> {
    const parse = createCommitteeSchema.safeParse(rawData)
    
    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { name } = parse.data

    const createGroupRes = await createGroup({
        groupType: "COMMITEE",
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
