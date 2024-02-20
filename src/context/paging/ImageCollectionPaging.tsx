'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readImageCollectionsPage } from '@/actions/images/collections/read'
import type { ReadPageInput } from '@/actions/Types'
import type { ImageCollectionPageReturn } from '@/actions/images/collections/read'

export type PageSizeImageCollection = 12
const fetcher = async (x: ReadPageInput<PageSizeImageCollection>) => {
    const ret = await readImageCollectionsPage(x)
    return ret
}

export const ImageCollectionPagingContext = generatePagingContext<ImageCollectionPageReturn, PageSizeImageCollection>()
const ImageCollectionPagingProvider = generatePagingProvider({ Context: ImageCollectionPagingContext, fetcher })
export default ImageCollectionPagingProvider
