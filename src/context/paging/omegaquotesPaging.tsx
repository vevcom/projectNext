'use client'
import generatePagingProvider, { generatePagingContext } from '@/context/paging/PagingGenerator'
import { readQuotesPage } from '@/actions/quotes/read'
import type { ReadPageInput } from '@/actions/type'
import type { OmegaquoteFiltered } from '@/actions/quotes/read'

export type PageSizeOmegaquote = 20;
const fetcher = async (x: ReadPageInput<PageSizeOmegaquote>) => await readQuotesPage(x)

export const OmegaquotePagingContext = generatePagingContext<OmegaquoteFiltered, PageSizeOmegaquote>()
const OmegaquotePagingProvider = generatePagingProvider({ Context: OmegaquotePagingContext, fetcher })
export default OmegaquotePagingProvider
