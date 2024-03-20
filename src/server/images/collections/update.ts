import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import { updateImageCollectionValidation } from '@/server/images/collections/schema'
import type { ImageCollection } from '@prisma/client'
import type { UpdateImageCollectionType } from '@/server/images/collections/schema'

/**
 * A function that updates an image collection
 * @param collectionId - the id of the collection to update
 * @param data - the data to update the collection with
 * @returns - the updated collection
 */
export async function updateImageCollection(
    collectionId: number,
    coverImageId: number | undefined,
    rawdata: UpdateImageCollectionType
): Promise<ImageCollection> {
    const data = updateImageCollectionValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.imageCollection.update({
        where: {
            id: collectionId,
        },
        data: {
            ...data,
            coverImage: {
                connect: coverImageId ? {
                    id: coverImageId
                } : undefined
            }
        }
    }))
}
