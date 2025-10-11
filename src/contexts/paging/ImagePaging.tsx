'use client'
import { generatePagingProvider, generatePagingContext } from './PagingGenerator'
import { readImagesPageAction } from '@/services/images/actions'
import type { Image } from '@prisma/client'
import type { ImageCursor, ImageDetails } from '@/services/images/types'

export type PageSizeImage = 30

export const ImagePagingContext = generatePagingContext<Image, ImageCursor, PageSizeImage, ImageDetails>()

export const ImagePagingProvider = generatePagingProvider({
    Context: ImagePagingContext,
    fetcher: async ({ paging }) => await readImagesPageAction({ paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
