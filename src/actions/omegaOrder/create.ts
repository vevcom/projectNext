'use server'
import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { createOmegaOrder } from '@/server/omegaOrder/create'
import type { ActionReturn } from '@/actions/Types'

export async function createOmegaOrderAction(): Promise<ActionReturn<void>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['OMEGA_ORDER_CREATE']]
    })
    if (!authorized) return createActionError(status)

    return safeServerCall(createOmegaOrder)
}
