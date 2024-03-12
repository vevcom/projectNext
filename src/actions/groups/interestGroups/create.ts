'use server'

import { createInterestGroupSchema } from './schema'
import { createZodActionError } from '@/actions/error'
import { createGroup } from '@/actions/groups/create'
import type { CreateInterestGroupSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedInterestGroup } from './Types'

export async function createInterestGroup(
    rawData: FormData | CreateInterestGroupSchemaType
): Promise<ActionReturn<ExpandedInterestGroup>> {
    const parse = createInterestGroupSchema.safeParse(rawData)

    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { name } = parse.data

    const createGroupRes = await createGroup({
        groupType: 'INTEREST_GROUP',
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
