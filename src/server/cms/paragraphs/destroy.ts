import 'server-only'
import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { CmsParagraph } from '@prisma/client'

export async function destroyCmsParagraph(id: number): Promise<ActionReturn<CmsParagraph>> {
    try {
        const cmsImage = await prisma.cmsParagraph.delete({
            where: { id },
        })
        return { success: true, data: cmsImage }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
