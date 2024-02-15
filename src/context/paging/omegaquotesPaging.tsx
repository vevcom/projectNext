'use client'
import generatePagingProvider, { generatePagingContext } from '@/context/paging/PagingGenerator'
import { readQuotesPage } from '@/actions/omegaquotes/read'
import type { ReadPageInput } from '@/actions/type'
import type { OmegaquoteFiltered } from '@/actions/omegaquotes/read'

export type PageSizeOmegaquote = 20;
const fetcher = async (x: ReadPageInput<PageSizeOmegaquote>) => await readQuotesPage(x)

export const OmegaquotePagingContext = generatePagingContext<OmegaquoteFiltered, PageSizeOmegaquote>()
const OmegaquotePagingProvider = generatePagingProvider({ Context: OmegaquotePagingContext, fetcher })
export default OmegaquotePagingProvider
