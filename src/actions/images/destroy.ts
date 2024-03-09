'use server'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function destroyImage(imageId: number): Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.findUnique({
            where: {
                id: imageId,
            },
        })
        if (!image) return { success: false, error: [{ message: 'Bilde ikke funnet' }] }
        if (image.special) return { success: false, error: [{ message: 'Kan ikke slette spesielle bilder' }] }

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
