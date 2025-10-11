'use client'
import { generatePagingProvider, generatePagingContext } from './PagingGenerator'
import { readImageCollectionsPageAction } from '@/services/images/collections/actions'
import type { ImageCollectionCursor, ImageCollectionPageReturn } from '@/services/images/collections/types'

export type PageSizeImageCollection = 12

export const ImageCollectionPagingContext = generatePagingContext<
    ImageCollectionPageReturn,
    ImageCollectionCursor,
    PageSizeImageCollection
>()

export const ImageCollectionPagingProvider = generatePagingProvider({
    Context: ImageCollectionPagingContext,
    fetcher: async ({ paging }) => await readImageCollectionsPageAction(paging),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})

