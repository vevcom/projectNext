'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import type { ReadPageInput } from '@/services/paging/Types'
import { EventArchiveCursor, EventArchiveDetails, EventFilteredWithImage } from '@/services/events/Types'
import { readArchivedEventsPage } from '@/actions/events/read'

export type PageSizeEventArchive = 12
const fetcher = async (x: ReadPageInput<PageSizeEventArchive, EventArchiveCursor, EventArchiveDetails>) => {
    const ret = await readArchivedEventsPage(x)
    return ret
}

export const EventArchivePagingContext = generatePagingContext<
    EventFilteredWithImage,
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