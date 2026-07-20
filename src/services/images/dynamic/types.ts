import type { Image, ImageCollection } from '@/prisma-generated-pn-types'

export type ImageCollectionCursor = {
    id: number,
}

export type ImageCollectionPageReturn = ImageCollection & {
    coverImage: Image | null,
    numberOfImages: number,
}
