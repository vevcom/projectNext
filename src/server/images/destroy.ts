import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import type { Image } from '@prisma/client'

export async function destroyImage(imageId: number): Promise<Image> {
    const image = await prismaCall(() => prisma.image.findUnique({
        where: {
            id: imageId,
        },
    }))
    if (!image) throw new ServerError('NOT FOUND', `Bilde ${imageId} ikke funnet`)
    if (image.special) throw new ServerError('BAD PARAMETERS', `Bilde ${imageId} er spesielt og kan ikke slettes`)

    //TODO: remove the image from store

    return await prismaCall(() => prisma.image.delete({
        where: {
            id: imageId,
        },
    }))
}
