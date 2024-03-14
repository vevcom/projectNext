import 'server-only'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function destroyImage(imageId: number): Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.findUnique({
            where: {
                id: imageId,
            },
        })
        if (!image) return createActionError('NOT FOUND', `Bilde ${imageId} ikke funnet`)
        if (image.special) return createActionError('BAD PARAMETERS', `Bilde ${imageId} er spesielt og kan ikke slettes`)

        //TODO: remove the image from store

        await prisma.image.delete({
            where: {
                id: imageId,
            },
        })

        return { success: true, data: image }
    } catch (error) {
        return createPrismaActionError(error)
    }
}