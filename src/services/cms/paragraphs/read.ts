import '@pn-server-only'
import { prisma } from '@/prisma/client'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import type { SpecialCmsParagraph, CmsParagraph } from '@prisma/client'

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
