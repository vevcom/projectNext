import 'server-only'
import type { ActionReturn } from '@/actions/Types'
import type { CmsParagraph } from '@prisma/client'
import { createPrismaActionError } from '@/actions/error'

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