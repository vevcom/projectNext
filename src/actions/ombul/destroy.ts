'use server'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/user'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedOmbul } from '@/server/ombul/Types'
import { destroyOmbul } from '@/server/ombul/destroy'

export async function destroyOmbulAction(id: number): Promise<ActionReturn<ExpandedOmbul>> {
    const { status, authorized } = await getUser({
        requiredPermissions: ['OMBUL_DESTROY']
    })

    if (!authorized) {
        return createActionError(status)
    }

    return await destroyOmbul(id)
}
