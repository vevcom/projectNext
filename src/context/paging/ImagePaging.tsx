'use client'

import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readImagesPage } from '@/actions/images/read'
import type { ReadPageInput } from '@/actions/type'
import type { Image } from '@prisma/client'
import type { ImageDetails } from '@/actions/images/Types'

export type PageSizeImage = 30
const fetcher = async (x: ReadPageInput<PageSizeImage, ImageDetails>) => {
    const ret = await readImagesPage(x)
    return ret
}

export const ImagePagingContext = generatePagingContext<Image, PageSizeImage, ImageDetails>()
const ImagePagingProvider = generatePagingProvider({ Context: ImagePagingContext, fetcher })
export default ImagePagingProvider
