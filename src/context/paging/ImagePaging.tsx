'use client'

import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readPage } from '@/actions/images/read'
import { ReadPageInput } from '@/actions/type'
import type { Image } from '@prisma/client'

export type PageSizeImage = 30
const fetcher = async (x: ReadPageInput<PageSizeImage, {collectionId: number}>) => {
    const ret = await readPage(x)
    return ret
}

export const ImagePagingContext = generatePagingContext<Image, PageSizeImage>()
const ImagePagingProvider = generatePagingProvider({ Context: ImagePagingContext, fetcher })
export default ImagePagingProvider
