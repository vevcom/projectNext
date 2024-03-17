import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { ImageCollection, Prisma } from '@prisma/client'

/**
 * A function that updates an image collection
 * @param collectionId - the id of the collection to update
 * @param data - the data to update the collection with
 * @returns - the updated collection
 */
export async function updateImageCollection(
    collectionId: number,
    data: Prisma.ImageCollectionUpdateInput
): Promise<ImageCollection> {
    return await prismaCall(() => prisma.imageCollection.update({
        where: {
            id: collectionId,
        },
        data
    }))
}
