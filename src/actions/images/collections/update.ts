'use server'
import { createZodActionError } from '@/actions/error'
import { updateImageCollection } from '@/server/images/collections/update'
import { safeServerCall } from '@/actions/safeServerCall'
import { updateImageCollectionValidation } from '@/server/images/collections/validation'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { UpdateImageCollectionTypes } from '@/server/images/collections/validation'

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
    rawdata: FormData | UpdateImageCollectionTypes['Type']
): Promise<ActionReturn<ImageCollection>> {
    const parse = updateImageCollectionValidation.typeValidate(rawdata)

    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateImageCollection(collectionId, coverImageId, data))
}
