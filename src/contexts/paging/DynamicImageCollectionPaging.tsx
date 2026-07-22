'use client'
import { generatePaging } from './PagingGenerator'
import { readDynamicImageCollectionsPageAction } from '@/services/images/dynamic/actions'
import type { ImageCollectionCursor } from '@/services/images/dynamic/types'
import type { ExpandedImageCollection } from '@/services/images/subservice/types'

export type PageSizeDynamicImageCollection = 12

export const [DynamicImageCollectionPagingContext, DynamicImageCollectionPagingProvider] = generatePaging<
    ExpandedImageCollection,
    ImageCollectionCursor,
    PageSizeDynamicImageCollection
>({
    fetcher: async ({ paging }) => await readDynamicImageCollectionsPageAction({ params: { paging } }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})

