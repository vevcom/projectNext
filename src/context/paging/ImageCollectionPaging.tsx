'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readImageCollectionsPageAction } from '@/actions/images/collections/read'
import type { ReadPageInput } from '@/actions/Types'
import type { ImageCollectionCursor, ImageCollectionPageReturn } from '@/server/images/collections/Types'

export type PageSizeImageCollection = 12
const fetcher = async (x: ReadPageInput<PageSizeImageCollection, ImageCollectionCursor>) => {
    const ret = await readImageCollectionsPageAction(x)
    return ret
}

export const ImageCollectionPagingContext = generatePagingContext<
    ImageCollectionPageReturn,
    ImageCollectionCursor,
    PageSizeImageCollection
>()
const ImageCollectionPagingProvider = generatePagingProvider({
    Context: ImageCollectionPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default ImageCollectionPagingProvider
