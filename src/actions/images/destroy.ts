'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'

export async function destroyImage(imageId: number): Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.delete({
            where: {
                id: imageId,
            },
        })
        return { success: true, data: image }
    } catch (error) {
        return errorHandler(error)
    }
}
