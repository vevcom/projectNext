import 'server-only'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { CmsParagraph, SpecialCmsParagraph } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

/**
 * A function to create a cms paragraph
 * @param name - name of the cms paragraph
 * @param config - Config for the paragraph, should it be special??
 * @returns 
 */
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