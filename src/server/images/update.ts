import 'server-only'
import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { Prisma, Image } from '@prisma/client'

export async function updateImage(
    imageId: number,
    data: Prisma.ImageUpdateInput
): Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.update({
            where: {
                id: imageId,
            },
            data
        })
        return { success: true, data: image }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
