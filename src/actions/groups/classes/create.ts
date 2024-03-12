'use server'

import { createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedClass } from './Types'
import { createGroup } from '@/actions/groups/create'
import { CreateClassSchemaType, createClassSchema } from './schema'

export async function createClass(rawData: FormData | CreateClassSchemaType): Promise<ActionReturn<ExpandedClass>> {
    const parse = createClassSchema.safeParse(rawData)
    
    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { name } = parse.data

    const createGroupRes = await createGroup({
        groupType: "CLASS",
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
