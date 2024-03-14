'use server'

import { createClassSchema } from './schema'
import { createZodActionError } from '@/actions/error'
import { createGroup } from '@/actions/groups/create'
import { readCurrenOmegaOrder } from '@/actions/omegaOrder/read'
import type { CreateClassSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedClass } from './Types'

export async function createClass(rawData: FormData | CreateClassSchemaType): Promise<ActionReturn<ExpandedClass>> {
    const parse = createClassSchema.safeParse(rawData)

    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { name } = parse.data

    const currentOrderRes = await readCurrenOmegaOrder()

    if (!currentOrderRes.success) {
        return currentOrderRes
    }

    const { order } = currentOrderRes.data

    const createGroupRes = await createGroup('CLASS', {
        membershipRenewal: true,
        name,
        details: {
            year: 1,
            order,
        }
    })

    if (!createGroupRes.success) {
        return createGroupRes
    }

    return {
        success: true,
        data: createGroupRes.data
    }
}
