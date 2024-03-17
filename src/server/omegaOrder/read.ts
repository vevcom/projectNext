'use server'
import prisma from '@/prisma'
import type { OmegaOrder } from '@prisma/client'
import { ServerError } from '../error'
import { prismaCall } from '../prismaCall'

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
