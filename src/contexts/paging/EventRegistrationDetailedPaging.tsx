'use client'
import { generatePaging } from './PagingGenerator'
import { eventRegistrationReadManyDetailedAction } from '@/services/events/registration/actions'
import type {
    EventRegistrationDetailedExpanded,
    EventRegistrationFetcherDetails
} from '@/services/events/registration/types'
import type { PageSizeUsers } from './UserPaging'

export const [EventRegistrationDetailedPagingContext, EventRegistrationDetailedPagingProvider] = generatePaging<
    EventRegistrationDetailedExpanded,
    number,
    PageSizeUsers,
    EventRegistrationFetcherDetails
>({
    fetcher: async ({ paging }) =>
        // TODO: These calculations should be done inside the function.
        await eventRegistrationReadManyDetailedAction({
            params: {
                eventId: paging.details.eventId,
                take: paging.page.pageSize,
                skip: (paging.page.page * paging.page.pageSize) || undefined,
                type: paging.details.type,
            }
        }),
    getCursor: ({ fetchedCount }) => fetchedCount,
})
