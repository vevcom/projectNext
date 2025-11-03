'use server'
import { safeServerCall } from '@/services/actionError'
import { createOmegaOrder } from '@/services/omegaOrder/create'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import type { ActionReturn } from '@/services/actionTypes'
import type { OmegaOrder } from '@prisma/client'

export async function createOmegaOrderAction(): Promise<ActionReturn<void>> {
    return safeServerCall(createOmegaOrder)
}

export async function readCurrentOmegaOrderAction(): Promise<ActionReturn<OmegaOrder>> {
    return await safeServerCall(() => readCurrentOmegaOrder())
}
