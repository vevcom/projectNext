'use server'
import { createCmsParagraph } from './create'
import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { CmsParagraph } from '@prisma/client'

export async function readCmsParagraph(name: string): Promise<ActionReturn<CmsParagraph>> {
    try {
        const paragraph = await prisma.cmsParagraph.findUnique({
            where: {
                name
            }
        })
        if (paragraph) {
            return {
                success: true,
                data: paragraph
            }
        }
        return createCmsParagraph(name)
    } catch (error) {
        return createPrismaActionError(error)
    }
}
