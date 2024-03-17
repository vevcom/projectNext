import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import type { ReadPageInput } from '@/actions/Types'
import type { ImageDetails } from '@/server/images/Types'
import type { Image, SpecialImage } from '@prisma/client'

export async function readImagesPage<const PageSize extends number>(
    { page, details }: ReadPageInput<PageSize, ImageDetails>
): Promise<Image[]> {
    const { collectionId } = details
    const { page: pageNumber, pageSize } = page
    return await prismaCall(() => prisma.image.findMany({
        where: {
            collectionId,
        },
        skip: pageNumber * pageSize,
        take: pageSize,
    }))
}

export async function readImage(idOrName: number | string): Promise<Image> {
    const image = await prismaCall(() => prisma.image.findUnique({
        where: {
            id: typeof idOrName === 'number' ? idOrName : undefined,
            name: typeof idOrName === 'string' ? idOrName : undefined,
        },
    }))

    if (!image) throw new ServerError('NOT FOUND', 'Image not found')
    return image
}

export async function readSpecialImage(special: SpecialImage): Promise<Image> {
    const image = await prisma.image.findUnique({
        where: {
            special,
        },
    })

    if (!image) throw new ServerError('NOT FOUND', 'Image not found')
    return image
}
