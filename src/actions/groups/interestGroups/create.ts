'use server'

import { createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedInterestGroup } from './Types'
import { createGroup } from '@/actions/groups/create'
import { CreateInterestGroupSchemaType, createInterestGroupSchema } from './schema'

export async function createInterestGroup(rawData: FormData | CreateInterestGroupSchemaType): Promise<ActionReturn<ExpandedInterestGroup>> {
    const parse = createInterestGroupSchema.safeParse(rawData)
    
    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { name } = parse.data

    const createGroupRes = await createGroup({
        groupType: "INTEREST_GROUP",
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
