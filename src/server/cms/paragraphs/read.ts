import 'server-only'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { SpecialCmsParagraph, CmsParagraph } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function readCmsParagraph(name: string): Promise<ActionReturn<CmsParagraph>> {
    try {
        const paragraph = await prisma.cmsParagraph.findUnique({
            where: {
                name
            }
        })
        if (!paragraph) return createActionError('NOT FOUND', 'CmsParagraph not found')
        return {
            success: true,
            data: paragraph
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

/**
 * This function reads a special paragraph from the database.
 * @param special - special paragraph to read
 * @returns - the special paragraph
 */
export async function readSpecialCmsParagraph(special: SpecialCmsParagraph): Promise<ActionReturn<CmsParagraph>> {
    try {
        const paragraph = await prisma.cmsParagraph.findUnique({
            where: {
                special
            }
        })
        if (paragraph) {
            return {
                success: true,
                data: paragraph
            }
        }
        return createActionError('NOT FOUND', 'Special CmsParagraph not found')
    } catch (error) {
        return createPrismaActionError(error)
    }
}
