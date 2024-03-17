import 'server-only'
import prisma from '@/prisma'
import type { CmsParagraph, SpecialCmsParagraph } from '@prisma/client'
import { prismaCall } from '@/server/prismaCall'

/**
 * A function to create a cms paragraph
 * @param name - name of the cms paragraph
 * @param config - Config for the paragraph, should it be special??
 * @returns
 */
export async function createCmsParagraph(name: string, config?: {
    special?: SpecialCmsParagraph
}): Promise<CmsParagraph> {
    return await prismaCall(() => prisma.cmsParagraph.create({
        data: {
            name,
            special: config?.special,
        },
    }))
}
