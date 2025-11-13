'use client'
import { generatePaging } from './PagingGenerator'
import { readManyEventRegistrationAction } from '@/services/events/registration/actions'
import type { EventRegistrationExpanded, EventRegistrationFetcherDetails } from '@/services/events/registration/types'
import type { PageSizeUsers } from './UserPaging'

export const [EventRegistrationPagingContext, EventRegistrationPagingProvider] = generatePaging<
    EventRegistrationExpanded,
    number,
    PageSizeUsers,
    EventRegistrationFetcherDetails
>({
    fetcher: async ({ paging }) => await readManyEventRegistrationAction({
        params: {
            eventId: paging.details.eventId,
            take: paging.page.pageSize,
            skip: (paging.page.page * paging.page.pageSize) || undefined,
            type: paging.details.type,
        }
    }),
    getCursor: ({ fetchedCount }) => (fetchedCount),
})
