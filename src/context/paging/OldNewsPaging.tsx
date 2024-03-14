'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readOldNewsPageAction } from '@/actions/news/read'
import type { ReadPageInput } from '@/actions/Types'
import type { SimpleNewsArticle } from '@/server/news/Types'

export type PageSizeOldNews = 20
const fetcher = async (x: ReadPageInput<PageSizeOldNews>) => await readOldNewsPageAction(x)

export const OldNewsPagingContext = generatePagingContext<SimpleNewsArticle, PageSizeOldNews>()
const OldNewsPagingProvider = generatePagingProvider({ Context: OldNewsPagingContext, fetcher })
export default OldNewsPagingProvider
