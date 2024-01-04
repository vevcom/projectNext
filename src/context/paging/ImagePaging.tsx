'use client'

import type { Image } from '@prisma/client'
import { readPage } from '@/actions/images/read'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { ReadPageInput } from '@/actions/type'

export type PageSizeImage = 30
const fetcher = async (x: ReadPageInput<PageSizeImage, {collectionId: number}>) => {
    const ret = await readPage(x)
    return ret
}

export const ImagePagingContext = generatePagingContext<Image, PageSizeImage, {collectionId: number}>()
const ImagePagingProvider = generatePagingProvider({ Context: ImagePagingContext, fetcher })
export default ImagePagingProvider
