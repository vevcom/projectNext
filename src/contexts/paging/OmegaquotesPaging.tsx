'use client'
import { generatePagingContext, generatePagingProvider } from '@/contexts/paging/PagingGenerator'
import { readQuotesPageAction } from '@/services/omegaquotes/actions'
import type { OmegaquoteCursor, OmegaquoteFiltered } from '@/services/omegaquotes/types'

export type PageSizeOmegaquote = 20;

export const OmegaquotePagingContext = generatePagingContext<OmegaquoteFiltered, OmegaquoteCursor, PageSizeOmegaquote>()

export const OmegaquotePagingProvider = generatePagingProvider({
    Context: OmegaquotePagingContext,
    fetcher: async ({ paging }) => await readQuotesPageAction(paging),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
