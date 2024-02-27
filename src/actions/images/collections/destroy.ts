'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function destroyImageCollection(collectionId: number): Promise<ActionReturn<ImageCollection>> {
    try {
        //only delete if the collection is not special
        const collection = await prisma.imageCollection.findUnique({
            where: {
                id: collectionId,
            },
        })
        if (!collection) return { success: false, error: [{ message: 'Collection not found' }] }
        if (collection.special) return { success: false, error: [{ message: 'Cannot delete special collections' }] }

        await prisma.imageCollection.delete({
            where: {
                id: collectionId,
            },
        })
        return { success: true, data: collection }
    } catch (error) {
        return errorHandler(error)
    }
}
