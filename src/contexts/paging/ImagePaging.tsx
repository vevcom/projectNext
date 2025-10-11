'use client'
import { generatePaging } from './PagingGenerator'
import { readImagesPageAction } from '@/services/images/actions'
import type { Image } from '@prisma/client'
import type { ImageCursor, ImageDetails } from '@/services/images/types'

export type PageSizeImage = 30

export const [ImagePagingContext, ImagePagingProvider] = generatePaging<
    Image,
    ImageCursor,
    PageSizeImage,
    ImageDetails
>({
    fetcher: async ({ paging }) => await readImagesPageAction({ paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
