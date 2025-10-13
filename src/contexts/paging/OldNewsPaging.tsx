'use client'
import { generatePaging } from './PagingGenerator'
import { readOldNewsPageAction } from '@/services/news/actions'
import type { NewsCursor, SimpleNewsArticle } from '@/services/news/types'

export type PageSizeOldNews = 20

export const [OldNewsPagingContext, OldNewsPagingProvider] = generatePaging<
    SimpleNewsArticle,
    NewsCursor,
    PageSizeOldNews
>({
    fetcher: async ({ paging }) => await readOldNewsPageAction(paging),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
