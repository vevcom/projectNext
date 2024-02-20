'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Typess'

export async function destroyImageCollection(collectionId: number): Promise<ActionReturn<ImageCollection>> {
    try {
        const collection = await prisma.imageCollection.delete({
            where: {
                id: collectionId,
            },
        })
        return { success: true, data: collection }
    } catch (error) {
        return errorHandler(error)
    }
}
