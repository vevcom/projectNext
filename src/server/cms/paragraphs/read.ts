import 'server-only'
import prisma from '@/prisma'
import type { SpecialCmsParagraph, CmsParagraph } from '@prisma/client'
import { ServerError } from '@/server/error'
import { prismaCall } from '@/server/prismaCall'

export async function readCmsParagraph(name: string): Promise<CmsParagraph> {
    const paragraph = await prismaCall(() => prisma.cmsParagraph.findUnique({
        where: {
            name
        }
    }))
    if (!paragraph) throw new ServerError('NOT FOUND', 'CmsParagraph not found')
    return paragraph
}

/**
 * This function reads a special paragraph from the database.
 * @param special - special paragraph to read
 * @returns - the special paragraph
 */
export async function readSpecialCmsParagraph(special: SpecialCmsParagraph): Promise<CmsParagraph> {
    const paragraph = await prismaCall(() => prisma.cmsParagraph.findUnique({
        where: {
            special
        }
    }))
    if (!paragraph) throw new ServerError('NOT FOUND', 'Special CmsParagraph not found')
    return paragraph
}
