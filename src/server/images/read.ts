import 'server-only'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { ImageDetails } from '@/actions/images/Types'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { Image } from '@prisma/client'

export async function readImagesPage<const PageSize extends number>(
    { page, details }: ReadPageInput<PageSize, ImageDetails>
): Promise<ActionReturn<Image[]>>  {
    const { collectionId } = details
    const { page: pageNumber, pageSize } = page
    try {
        const images = await prisma.image.findMany({
            where: {
                collectionId,
            },
            skip: pageNumber * pageSize,
            take: pageSize,
        })

        if (!images) return createActionError('NOT FOUND', 'No images found')
        return { success: true, data: images }
    } catch (error) {
        return createPrismaActionError(error)
    }
}