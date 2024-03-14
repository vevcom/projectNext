'use server'

import 'server-only'
import { createGroup } from '@/server/groups/create'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedClass } from './Types'
import { GroupCreateInput } from '@/server/groups/Types'

export async function createClass({ 
    details,
    ...data
}: GroupCreateInput<'CLASS'>): Promise<ActionReturn<ExpandedClass>> {
    const currentOrderRes = await readCurrenOmegaOrder()

    if (!currentOrderRes.success) {
        return currentOrderRes
    }

    const { order } = currentOrderRes.data

    const createGroupRes = await createGroup('CLASS', {
        ...data,
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
