import 'server-only'
import { cursorPageingSelection } from '@/services/paging/cursorPageingSelection'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import prisma from '@/prisma'
import type { ReadPageInput } from '@/services/paging/Types'
import type { ImageDetails, ImageCursor } from '@/services/images/Types'
import type { Image, SpecialImage } from '@prisma/client'

export async function readImagesPage<const PageSize extends number>(
    { page, details }: ReadPageInput<PageSize, ImageCursor, ImageDetails>
): Promise<Image[]> {
    const { collectionId } = details
    return await prismaCall(() => prisma.image.findMany({
        where: {
            collectionId,
        },
        ...cursorPageingSelection(page)
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
