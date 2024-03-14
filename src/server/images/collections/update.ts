import 'server-only'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ImageCollection, Prisma } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

/**
 * A function that updates an image collection
 * @param collectionId - the id of the collection to update
 * @param data - the data to update the collection with
 * @returns - the updated collection in ActionReturn
 */
export async function updateImageCollection(
    collectionId: number,
    data: Prisma.ImageCollectionUpdateInput
): Promise<ActionReturn<ImageCollection>> {
    try {
        const collection = await prisma.imageCollection.update({
            where: {
                id: collectionId,
            },
            data
        })
        return { success: true, data: collection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
