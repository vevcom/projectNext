'use client'
import { generatePagingProvider, generatePagingContext } from './PagingGenerator'

import { readDotPageAction } from '@/services/dots/actions'
import type { DotDetails, DotCursor, DotWrapperWithDots } from '@/services/dots/types'

export type PageSizeDots = 30

export const DotPagingContext = generatePagingContext<
    DotWrapperWithDots,
    DotCursor,
    PageSizeDots,
    DotDetails
>()

export const DotPagingProvider = generatePagingProvider({
    Context: DotPagingContext,
    fetcher: async ({ paging }) => await readDotPageAction({ paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
