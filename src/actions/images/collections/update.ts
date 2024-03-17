'use server'
import { updateImageCollectionSchema } from './schema'
import { createZodActionError } from '@/actions/error'
import { updateImageCollection } from '@/server/images/collections/update'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { UpdateImageCollectionSchemaType } from './schema'
import { safeServerCall } from '@/actions/safeServerCall'

/**
 * A action that updates an image collection
 * @param collectionId - the id of the collection to update
 * @param coverImageId - the id of the image to set as the cover image (optional)
 * @param rawdata - the data to update the collection with
 * @returns - the updated collection in ActionReturn
 */
export async function updateImageCollectionAction(
    collectionId: number,
    coverImageId: number | undefined,
    rawdata: FormData | UpdateImageCollectionSchemaType
): Promise<ActionReturn<ImageCollection>> {
    const parse = updateImageCollectionSchema.safeParse(rawdata)

    if (!parse.success) return createZodActionError(parse)
    const data = {
        ...parse.data,
        coverImage: coverImageId ? {
            connect: {
                id: coverImageId
            }
        } : undefined
    }
    return await safeServerCall(() => updateImageCollection(collectionId, data))
}
