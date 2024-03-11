'use server'
import { createCmsParagraph } from './create'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import { SpecialCmsParagraph } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { CmsParagraph } from '@prisma/client'

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
 * This function reads a special paragraph from the database, if it does not exist it will create it
 * @param special - special paragraph to read
 * @returns - the paragraph
 */
export async function readSpecialCmsParagraph(special: SpecialCmsParagraph): Promise<ActionReturn<CmsParagraph>> {
    if (!Object.values(SpecialCmsParagraph).includes(special)) return createActionError('BAD PARAMETERS', `${special} is not special`)

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
        return createCmsParagraph(special, { special })
    } catch (error) {
        return createPrismaActionError(error)
    }
}
