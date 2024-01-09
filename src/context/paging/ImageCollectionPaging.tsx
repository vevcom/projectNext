'use client'
import type { ImageCollection } from '@prisma/client'
import { readPage } from '@/actions/images/collections/read'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { ReadPageInput } from '@/actions/type'

export type PageSizeImageCollection = 15
const fetcher = async (x: ReadPageInput<PageSizeImageCollection, {}>) => {
    const ret = await readPage(x)
    return ret
}

export const ImageCollectionPagingContext = generatePagingContext<ImageCollection, PageSizeImageCollection>()
const ImageCollectionPagingProvider = generatePagingProvider({ Context: ImageCollectionPagingContext, fetcher })
export default ImageCollectionPagingProvider