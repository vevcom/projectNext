'use server'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '../type'

export default async function destroy(imageId: number): Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.delete({
            where: {
                id: imageId,
            },
        })
        return { success: true, data: image }
    } catch (error) {
        return errorHandeler(error)
    }
}
