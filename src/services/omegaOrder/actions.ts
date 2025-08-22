'use server'

import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ActionReturn } from '@/actions/Types'
import { getUser } from '@/auth/getUser'
import { createOmegaOrder } from '@/services/omegaOrder/create'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import type { OmegaOrder } from '@prisma/client'

export async function createOmegaOrderAction(): Promise<ActionReturn<void>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['OMEGA_ORDER_CREATE']]
    })
    if (!authorized) return createActionError(status)

    return safeServerCall(createOmegaOrder)
}

export async function readCurrentOmegaOrderAction(): Promise<ActionReturn<OmegaOrder>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['OMEGA_ORDER_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readCurrentOmegaOrder())
}
