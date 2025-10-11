'use client'
import { generatePagingProvider, generatePagingContext } from './PagingGenerator'
import { eventRegistrationReadManyDetailedAction } from '@/services/events/registration/actions'
import type {
    EventRegistrationDetailedExpanded,
    EventRegistrationFetcherDetails
} from '@/services/events/registration/types'
import type { PageSizeUsers } from './UserPaging'

export const EventRegistrationDetailedPagingContext =
    generatePagingContext<EventRegistrationDetailedExpanded, number, PageSizeUsers, EventRegistrationFetcherDetails>()

export const EventRegistrationDetailedPagingProvider = generatePagingProvider({
    Context: EventRegistrationDetailedPagingContext,
    fetcher: async ({ paging }) =>
        // TODO: These calculations should be done inside the function.
        await eventRegistrationReadManyDetailedAction({
            eventId: paging.details.eventId,
            take: paging.page.pageSize,
            skip: (paging.page.page * paging.page.pageSize) || undefined,
            type: paging.details.type,
        }),
    getCursor: ({ fetchedCount }) => fetchedCount,
})
