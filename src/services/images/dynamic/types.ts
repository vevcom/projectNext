import type { dynamicImageSchemas } from './schemas'
import type { InferPagingCursor } from '@/lib/paging/schema'
import type { Image, ImageCollection } from '@/prisma-generated-pn-types'

export type ImageCollectionCursor = InferPagingCursor<typeof dynamicImageSchemas.readCollectionPage>

export type ImageCollectionPageReturn = ImageCollection & {
    coverImage: Image | null,
    numberOfImages: number,
}
