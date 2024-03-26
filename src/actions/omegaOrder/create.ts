'use server'
import type { ActionReturn } from '@/actions/Types'
import { getUser } from '@/auth/getUser'
import { createActionError } from '../error'
import { safeServerCall } from '../safeServerCall'
import { createOmegaOrder } from '@/server/omegaOrder/create'

export async function createOmegaOrderAction(): Promise<ActionReturn<void>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['OMEGA_ORDER_CREATE']]
    })
    if (!authorized) return createActionError(status)

    return safeServerCall(createOmegaOrder)
}