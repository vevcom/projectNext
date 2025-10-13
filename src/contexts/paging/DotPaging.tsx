'use client'
import { generatePaging } from './PagingGenerator'

import { readDotPageAction } from '@/services/dots/actions'
import type { DotDetails, DotCursor, DotWrapperWithDots } from '@/services/dots/types'

export type PageSizeDots = 30

export const [DotPagingContext, DotPagingProvider] = generatePaging<
    DotWrapperWithDots,
    DotCursor,
    PageSizeDots,
    DotDetails
>({
    fetcher: async ({ paging }) => await readDotPageAction({ params: { paging } }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
