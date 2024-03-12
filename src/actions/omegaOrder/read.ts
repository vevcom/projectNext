'use server'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { OmegaOrder } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function readCurrenOmegaOrder(): Promise<ActionReturn<OmegaOrder>> {
    try {
        const omegaOrder = await prisma.omegaOrder.findFirst({
            orderBy: {
                order: 'desc'
            }
        })
        if (!omegaOrder) return createActionError('NOT FOUND', 'Current OmegaOrder not found')
        return { success: true, data: omegaOrder }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
