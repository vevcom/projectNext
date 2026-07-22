import type { imageSchemas } from '@/services/images/subservice/schemas'
import type { ActionFromSubServiceOperation } from '@/services/actionTypes'
import type { SubServiceOperation } from '@/services/serviceOperation'
import type { Image, ImageCollection } from '@/prisma-generated-pn-types'

/**
 * The action type for uploading/updating an image.
 */
export type UploadSpecialCollectionImageAction = ActionFromSubServiceOperation<
    SubServiceOperation<unknown, false, undefined, typeof imageSchemas.uploadImage>
>

/**
 * An image collection enriched with a resolved cover image and its image count - the shape needed
 * to render a CollectionCard.
 */
export type ExpandedImageCollection = ImageCollection & {
    coverImage: Image | null,
    numberOfImages: number,
}
