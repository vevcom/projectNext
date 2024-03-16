'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readImageCollectionsPageAction } from '@/actions/images/collections/read'
import type { ReadPageInput } from '@/actions/Types'
import type { ImageCollectionPageReturn } from '@/server/images/collections/Types'

export type PageSizeImageCollection = 12
const fetcher = async (x: ReadPageInput<PageSizeImageCollection>) => {
    const ret = await readImageCollectionsPageAction(x)
    return ret
}

export const ImageCollectionPagingContext = generatePagingContext<ImageCollectionPageReturn, PageSizeImageCollection>()
const ImageCollectionPagingProvider = generatePagingProvider({ Context: ImageCollectionPagingContext, fetcher })
export default ImageCollectionPagingProvider
