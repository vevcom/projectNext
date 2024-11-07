'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readDotPage } from '@/actions/dots/read'
import type { ReadPageInput } from '@/services/paging/Types'
import type { DotDetails, DotCursor, DotWrapperWithDots } from '@/services/dots/Types'

export type PageSizeDots = 30
const fetcher = async (x: ReadPageInput<PageSizeDots, DotCursor, DotDetails>) => {
    const ret = await readDotPage.bind(null, { paging: x })()
    return ret
}

export const DotPagingContext = generatePagingContext<
    DotWrapperWithDots,
    DotCursor,
    PageSizeDots,
    DotDetails
>()
const DotPagingProvider = generatePagingProvider({
    Context: DotPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default DotPagingProvider
