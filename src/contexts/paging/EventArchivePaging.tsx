'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readArchivedEventsPageAction } from '@/actions/events/read'
import type { EventArchiveCursor, EventArchiveDetails, EventExpanded } from '@/services/events/Types'
import type { ReadPageInput } from '@/lib/paging/Types'

export type PageSizeEventArchive = 12
const fetcher = async (x: ReadPageInput<PageSizeEventArchive, EventArchiveCursor, EventArchiveDetails>) => {
    const ret = await readArchivedEventsPageAction({ paging: x })
    return ret
}

export const EventArchivePagingContext = generatePagingContext<
    EventExpanded,
    EventArchiveCursor,
    PageSizeEventArchive,
    EventArchiveDetails
>()
const EventArchivePagingProvider = generatePagingProvider({
    Context: EventArchivePagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default EventArchivePagingProvider
