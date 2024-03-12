'use server'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { CmsParagraph, SpecialCmsParagraph } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function createCmsParagraph(name: string, config?: {
    special?: SpecialCmsParagraph
}): Promise<ActionReturn<CmsParagraph>> {
    try {
        const created = await prisma.cmsParagraph.create({
            data: {
                name,
                special: config?.special,
            },
        })
        return { success: true, data: created }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
