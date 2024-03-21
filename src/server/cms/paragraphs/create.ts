import 'server-only'
import { createCmsParagraphValidation } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { CreateCmsParagraphTypes } from './validation'
import type { CmsParagraph } from '@prisma/client'

/**
 * A function to create a cms paragraph
 * @param name - name of the cms paragraph
 * @param config - Config for the paragraph, should it be special??
 * @returns
 */
export async function createCmsParagraph(
    rawData: CreateCmsParagraphTypes['Detailed']
): Promise<CmsParagraph> {
    const data = createCmsParagraphValidation.detailedValidate(rawData)

    return await prismaCall(() => prisma.cmsParagraph.create({
        data,
    }))
}
