'use client'
import { generatePaging } from './PagingGenerator'
import { readImageCollectionsPageAction } from '@/services/images/dynamic/actions'
import type { ImageCollectionCursor, ImageCollectionPageReturn } from '@/services/images/dynamic/types'

export type PageSizeImageCollection = 12

export const [ImageCollectionPagingContext, ImageCollectionPagingProvider] = generatePaging<
    ImageCollectionPageReturn,
    ImageCollectionCursor,
    PageSizeImageCollection
>({
    fetcher: async ({ paging }) => await readImageCollectionsPageAction({ params: { paging } }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})

