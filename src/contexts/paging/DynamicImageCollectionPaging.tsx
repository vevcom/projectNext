'use client'
import { generatePaging } from './PagingGenerator'
import { readDynamicImageCollectionsPageAction } from '@/services/images/dynamic/actions'
import type { ImageCollectionCursor, ImageCollectionPageReturn } from '@/services/images/dynamic/types'

export type PageSizeDynamicImageCollection = 12

export const [DynamicImageCollectionPagingContext, DynamicImageCollectionPagingProvider] = generatePaging<
    ImageCollectionPageReturn,
    ImageCollectionCursor,
    PageSizeDynamicImageCollection
>({
    fetcher: async ({ paging }) => await readDynamicImageCollectionsPageAction({ params: { paging } }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})

