import 'server-only'
import { createCmsParagraphSchema } from './schema'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { CreateCmsParagraphType } from './schema'
import type { CmsParagraph } from '@prisma/client'

/**
 * A function to create a cms paragraph
 * @param name - name of the cms paragraph
 * @param config - Config for the paragraph, should it be special??
 * @returns
 */
export async function createCmsParagraph(
    rawData: CreateCmsParagraphType
): Promise<CmsParagraph> {
    const data = createCmsParagraphSchema.detailedValidate(rawData)

    return await prismaCall(() => prisma.cmsParagraph.create({
        data,
    }))
}
