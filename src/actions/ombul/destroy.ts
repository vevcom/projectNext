'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { destroyOmbul } from '@/services/ombul/destroy'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedOmbul } from '@/services/ombul/Types'

export async function destroyOmbulAction(id: number): Promise<ActionReturn<ExpandedOmbul>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_DESTROY']]
    })

    if (!authorized) return createActionError(status)

    return await safeServerCall(() => destroyOmbul(id))
}
