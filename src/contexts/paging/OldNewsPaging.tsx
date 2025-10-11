'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readOldNewsPageAction } from '@/services/news/actions'
import type { ReadPageInput } from '@/lib/paging/types'
import type { NewsCursor, SimpleNewsArticle } from '@/services/news/types'

export type PageSizeOldNews = 20
const fetcher = async (x: ReadPageInput<PageSizeOldNews, NewsCursor>) => await readOldNewsPageAction(x)

export const OldNewsPagingContext = generatePagingContext<SimpleNewsArticle, NewsCursor, PageSizeOldNews>()
const OldNewsPagingProvider = generatePagingProvider({
    Context: OldNewsPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default OldNewsPagingProvider
