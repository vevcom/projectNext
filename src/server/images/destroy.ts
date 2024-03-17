import 'server-only'
import prisma from '@/prisma'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import { prismaCall } from '../prismaCall'
import { ServerError } from '../error'

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
