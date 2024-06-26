'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readOldNewsPageAction } from '@/actions/news/read'
import type { ReadPageInput } from '@/actions/Types'
import type { NewsCursor, SimpleNewsArticle } from '@/server/news/Types'

export type PageSizeOldNews = 20
const fetcher = async (x: ReadPageInput<PageSizeOldNews, NewsCursor>) => await readOldNewsPageAction(x)

export const OldNewsPagingContext = generatePagingContext<SimpleNewsArticle, NewsCursor, PageSizeOldNews>()
const OldNewsPagingProvider = generatePagingProvider({
    Context: OldNewsPagingContext,
    fetcher,
    getCursorAfterFetch: data => ({ id: data[data.length - 1].id }),
})
export default OldNewsPagingProvider
