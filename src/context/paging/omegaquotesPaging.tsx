'use client'

import generatePagingProvider, { generatePagingContext } from '@/context/paging/PagingGenerator'
import { readPage } from '@/actions/quotes/read'
import { ReadPageInput } from '@/actions/type'
import type { OmegaquoteFiltered } from '@/actions/quotes/read'

export type PageSizeOmegaquote = 20;
const fetcher = async (x: ReadPageInput<PageSizeOmegaquote>) => await readPage(x)

export const OmegaquotePagingContext = generatePagingContext<OmegaquoteFiltered, PageSizeOmegaquote>()
const OmegaquotePagingProvider = generatePagingProvider({ Context: OmegaquotePagingContext, fetcher })
export default OmegaquotePagingProvider
