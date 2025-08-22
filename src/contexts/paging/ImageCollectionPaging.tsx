'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readImageCollectionsPageAction } from '@/services/images/collections/actions'
import type { ReadPageInput } from '@/lib/paging/Types'
import type { ImageCollectionCursor, ImageCollectionPageReturn } from '@/services/images/collections/Types'

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
