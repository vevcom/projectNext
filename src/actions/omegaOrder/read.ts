'use server'
import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import type { ActionReturn } from '@/actions/Types'
import type { OmegaOrder } from '@prisma/client'

export async function readCurrentOmegaOrderAction(): Promise<ActionReturn<OmegaOrder>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['OMEGA_ORDER_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readCurrentOmegaOrder())
}
