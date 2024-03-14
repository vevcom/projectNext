'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readImagesPageAction } from '@/actions/images/read'
import type { ReadPageInput } from '@/actions/Types'
import type { Image } from '@prisma/client'
import type { ImageDetails } from '@/actions/images/Types'

export type PageSizeImage = 30
const fetcher = async (x: ReadPageInput<PageSizeImage, ImageDetails>) => {
    const ret = await readImagesPageAction(x)
    return ret
}

export const ImagePagingContext = generatePagingContext<Image, PageSizeImage, ImageDetails>()
const ImagePagingProvider = generatePagingProvider({ Context: ImagePagingContext, fetcher })
export default ImagePagingProvider
