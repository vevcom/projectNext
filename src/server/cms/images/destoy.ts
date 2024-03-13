import 'server-only'
import type { ActionReturn } from '@/actions/Types'
import type { CmsImage } from '@prisma/client'
import { createPrismaActionError } from '@/actions/error'

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