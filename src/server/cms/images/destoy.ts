import 'server-only'
import prisma from '@/prisma'
import type { CmsImage } from '@prisma/client'
import { prismaCall } from '@/server/prismaCall'

/**
 * Destoys a cms image
 * @param id - The id of the cms image to destroy
 * @returns
 */
export async function destroyCmsImage(id: number): Promise<CmsImage> {
    return await prismaCall(() => prisma.cmsImage.delete({
        where: { id },
    }))
}
