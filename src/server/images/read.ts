import 'server-only'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { ImageDetails } from '@/server/images/Types'
import type { Image, SpecialImage } from '@prisma/client'

export async function readImagesPage<const PageSize extends number>(
    { page, details }: ReadPageInput<PageSize, ImageDetails>
): Promise<ActionReturn<Image[]>> {
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

export async function readImage(idOrName: number | string): Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.findUnique({
            where: {
                id: typeof idOrName === 'number' ? idOrName : undefined,
                name: typeof idOrName === 'string' ? idOrName : undefined,
            },
        })

        if (!image) return createActionError('NOT FOUND', 'Image not found')
        return { success: true, data: image }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

export async function readSpecialImage(special: SpecialImage): Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.findUnique({
            where: {
                special,
            },
        })

        if (!image) return createActionError('NOT FOUND', 'Image not found')
        return { success: true, data: image }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
