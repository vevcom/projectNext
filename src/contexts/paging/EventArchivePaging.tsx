'use client'
import { generatePagingProvider, generatePagingContext } from './PagingGenerator'
import { readArchivedEventsPageAction } from '@/services/events/actions'
import type { EventArchiveCursor, EventArchiveDetails, EventExpanded } from '@/services/events/types'

export type PageSizeEventArchive = 12

export const EventArchivePagingContext = generatePagingContext<
    EventExpanded,
    EventArchiveCursor,
    PageSizeEventArchive,
    EventArchiveDetails
>()

export const EventArchivePagingProvider = generatePagingProvider({
    Context: EventArchivePagingContext,
    fetcher: async ({ paging }) => await readArchivedEventsPageAction({ paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
