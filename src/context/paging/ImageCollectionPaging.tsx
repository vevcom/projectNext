'use client'
import type { ImageCollectionPageReturn } from '@/actions/images/collections/read'
import { readPage } from '@/actions/images/collections/read'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { ReadPageInput } from '@/actions/type'

export type PageSizeImageCollection = 12
const fetcher = async (x: ReadPageInput<PageSizeImageCollection, null>) => {
    const ret = await readPage(x)
    return ret
}

export const ImageCollectionPagingContext = generatePagingContext<ImageCollectionPageReturn, PageSizeImageCollection>()
const ImageCollectionPagingProvider = generatePagingProvider({ Context: ImageCollectionPagingContext, fetcher })
export default ImageCollectionPagingProvider
