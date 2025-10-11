'use client'
import { generatePagingProvider, generatePagingContext } from './PagingGenerator'
import { readOldNewsPageAction } from '@/services/news/actions'
import type { NewsCursor, SimpleNewsArticle } from '@/services/news/types'

export type PageSizeOldNews = 20

export const OldNewsPagingContext = generatePagingContext<SimpleNewsArticle, NewsCursor, PageSizeOldNews>()
export const OldNewsPagingProvider = generatePagingProvider({
    Context: OldNewsPagingContext,
    fetcher: async ({ paging }) => await readOldNewsPageAction(paging),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
