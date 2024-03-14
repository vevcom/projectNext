import 'server-only'
import { createGroup } from '@/server/groups/create'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedClass } from './Types'

type CreateClassArgs = {
    name: string,
    details: {
        year: number,
    }
}

export async function createClass({
    name,
    details,
}: CreateClassArgs): Promise<ActionReturn<ExpandedClass>> {
    const currentOrderRes = await readCurrenOmegaOrder()

    if (!currentOrderRes.success) {
        return currentOrderRes
    }

    const { order } = currentOrderRes.data

    const createGroupRes = await createGroup('CLASS', {
        membershipRenewal: false,
        name,
        details: {
            order,
            ...details,
        },
    })

    if (!createGroupRes.success) {
        return createGroupRes
    }

    return {
        success: true,
        data: createGroupRes.data
    }
}
