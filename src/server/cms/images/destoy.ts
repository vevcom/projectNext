import 'server-only'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { CmsImage } from '@prisma/client'

/**
 * Destoys a cms image
 * @param id - The id of the cms image to destroy
 * @returns
 */
export async function destroyCmsImage(id: number): Promise<ActionReturn<CmsImage>> {
    try {
        const cmsImage = await prisma.cmsImage.delete({
            where: { id },
        })
        return { success: true, data: cmsImage }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
