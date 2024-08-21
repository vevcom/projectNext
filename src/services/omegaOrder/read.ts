'use server'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { OmegaOrder } from '@prisma/client'

/**
 * A function to read the current OmegaOrder. That is the last OmegaOrder created, with
 * heighst order.
 * @returns - the current OmegaOrder
 */
export async function readCurrenOmegaOrder(): Promise<OmegaOrder> {
    const omegaOrder = await prismaCall(() => prisma.omegaOrder.findFirst({
        orderBy: {
            order: 'desc'
        }
    }))
    if (!omegaOrder) throw new ServerError('NOT FOUND', 'Current OmegaOrder not found')
    return omegaOrder
}
