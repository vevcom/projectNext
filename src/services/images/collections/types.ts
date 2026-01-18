import type { Image, ImageCollection } from '@/prisma-generated-pn-types'

export type ExpandedImageCollection = ImageCollection & {
    coverImage: Image | null
}

export type ImageCollectionPageReturn = ImageCollection & {
    coverImage: Image | null,
    numberOfImages: number,
}

export type ImageCollectionCursor = {
    id: number
}
