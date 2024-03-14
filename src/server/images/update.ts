import 'server-only'
import { Prisma } from '@prisma/client';
import { createPrismaActionError } from '@/actions/error';
import { ActionReturn } from '@/actions/Types';
import type { Image } from '@prisma/client';

export async function updateImage(
    imageId: number, 
    data: Prisma.ImageUpdateInput
) : Promise<ActionReturn<Image>> {
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