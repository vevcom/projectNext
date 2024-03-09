'use server'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { CmsParagraph } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function createCmsParagraph(name: string): Promise<ActionReturn<CmsParagraph>> {
    try {
        const created = await prisma.cmsParagraph.create({
            data: {
                name,
            },
        })
        return { success: true, data: created }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
