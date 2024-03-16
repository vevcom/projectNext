import type { Image, ImageCollection } from '@prisma/client'

export type ExpandedImageCollection = ImageCollection & {
    coverImage: Image | null
}

export type ImageCollectionPageReturn = ImageCollection & {
    coverImage: Image | null,
    numberOfImages: number,
}
