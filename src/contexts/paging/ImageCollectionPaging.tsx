'use client'
import { generatePaging } from './PagingGenerator'
import { readImageCollectionsPageAction } from '@/services/images/collections/actions'
import type { ImageCollectionCursor, ImageCollectionPageReturn } from '@/services/images/collections/types'

export type PageSizeImageCollection = 12

export const [ImageCollectionPagingContext, ImageCollectionPagingProvider] = generatePaging<
    ImageCollectionPageReturn,
    ImageCollectionCursor,
    PageSizeImageCollection
>({
    fetcher: async ({ paging }) => await readImageCollectionsPageAction(paging),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})

