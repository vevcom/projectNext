'use client'
import generatePagingProvider, { generatePagingContext } from '@/contexts/paging/PagingGenerator'
import { readQuotesPageAction } from '@/actions/omegaquotes/read'
import type { ReadPageInput } from '@/lib/paging/Types'
import type { OmegaquoteCursor, OmegaquoteFiltered } from '@/services/omegaquotes/Types'

export type PageSizeOmegaquote = 20;
const fetcher = async (x: ReadPageInput<PageSizeOmegaquote, OmegaquoteCursor>) => await readQuotesPageAction(x)

export const OmegaquotePagingContext = generatePagingContext<OmegaquoteFiltered, OmegaquoteCursor, PageSizeOmegaquote>()
const OmegaquotePagingProvider = generatePagingProvider({
    Context: OmegaquotePagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),

})
export default OmegaquotePagingProvider
