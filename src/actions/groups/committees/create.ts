'use server'

import { createCommitteeSchema } from './schema'
import { createZodActionError } from '@/actions/error'
import { createGroup } from '@/actions/groups/create'
import type { CreateCommitteeSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedCommitte } from './Types'

export async function createCommittee(
    rawData: FormData | CreateCommitteeSchemaType
): Promise<ActionReturn<ExpandedCommitte>> {
    const parse = createCommitteeSchema.safeParse(rawData)

    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { name } = parse.data

    const createGroupRes = await createGroup({
        groupType: 'COMMITTEE',
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
