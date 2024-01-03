'use client'

import type { Image } from '@prisma/client'
import read from '@/actions/images/collections/read'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { ReadPageInput } from '@/actions/type'

export type PageSizeImage = 30
const fetcher = async (x: ReadPageInput<PageSizeImage, {id: number}>) => {
    const ret = await read(x)
    return {
        ...ret,
        data: ret.data?.images
    }
}

export const ImagePagingContext = generatePagingContext<Image, PageSizeImage, {id: number}>();
const ImagePagingProvider = generatePagingProvider({Context: ImagePagingContext, fetcher})
export default ImagePagingProvider