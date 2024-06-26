'use client'
import generatePagingProvider, { generatePagingContext } from '@/context/paging/PagingGenerator'
import { readQuotesPageAction } from '@/actions/omegaquotes/read'
import type { ReadPageInput } from '@/actions/Types'
import type { OmegaquoteCursor, OmegaquoteFiltered } from '@/server/omegaquotes/Types'

export type PageSizeOmegaquote = 20;
const fetcher = async (x: ReadPageInput<PageSizeOmegaquote, OmegaquoteCursor>) => await readQuotesPageAction(x)

export const OmegaquotePagingContext = generatePagingContext<OmegaquoteFiltered, OmegaquoteCursor,PageSizeOmegaquote>()
const OmegaquotePagingProvider = generatePagingProvider({ Context: OmegaquotePagingContext, fetcher })
export default OmegaquotePagingProvider
