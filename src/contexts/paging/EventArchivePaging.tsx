'use client'
import { generatePaging } from './PagingGenerator'
import { readArchivedEventsPageAction } from '@/services/events/actions'
import type { EventArchiveCursor, EventArchiveDetails, EventExpanded } from '@/services/events/types'

export type PageSizeEventArchive = 12

export const [EventArchivePagingContext, EventArchivePagingProvider] = generatePaging<
    EventExpanded,
    EventArchiveCursor,
    PageSizeEventArchive,
    EventArchiveDetails
>({
    fetcher: async ({ paging }) => await readArchivedEventsPageAction({ paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
