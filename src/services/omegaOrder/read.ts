'use server'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { OmegaOrder } from '@/prisma-generated-pn-types'

/**
 * A function to read the current OmegaOrder. That is the last OmegaOrder created, with
 * heighst order.
 * @returns - the current OmegaOrder
 */
export async function readCurrentOmegaOrder(): Promise<OmegaOrder> {
    const omegaOrder = await prismaCall(() => prisma.omegaOrder.findFirst({
        orderBy: {
            order: 'desc'
        }
    }))
    if (!omegaOrder) throw new ServerError('NOT FOUND', 'Current OmegaOrder not found')
    return omegaOrder
}

export async function readOmegaOrders(): Promise<OmegaOrder[]> {
    return await prismaCall(() => prisma.omegaOrder.findMany())
}
