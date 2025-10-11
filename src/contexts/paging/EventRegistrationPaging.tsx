'use client'
import { generatePagingProvider, generatePagingContext } from './PagingGenerator'
import { readManyEventRegistrationAction } from '@/services/events/registration/actions'
import type { EventRegistrationExpanded, EventRegistrationFetcherDetails } from '@/services/events/registration/types'
import type { PageSizeUsers } from './UserPaging'

export const EventRegistrationPagingContext =
    generatePagingContext<EventRegistrationExpanded, number, PageSizeUsers, EventRegistrationFetcherDetails>()

export const EventRegistrationPagingProvider = generatePagingProvider({
    Context: EventRegistrationPagingContext,
    fetcher: async ({ paging }) => await readManyEventRegistrationAction({
        eventId: paging.details.eventId,
        take: paging.page.pageSize,
        skip: (paging.page.page * paging.page.pageSize) || undefined,
        type: paging.details.type,
    }),
    getCursor: ({ fetchedCount }) => (fetchedCount),
})
