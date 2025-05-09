'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { eventRegistrationReadManyDetailedAction } from '@/actions/events/registration'
import type {
    EventRegistrationDetailedExpanded,
    EventRegistrationFetcherDetails
} from '@/services/events/registration/Types'
import type { PageSizeUsers } from './UserPaging'
import type { ReadPageInput } from '@/lib/paging/Types'

const fetcher = async (x: ReadPageInput<PageSizeUsers, number, EventRegistrationFetcherDetails>) => {
    const registrations = await eventRegistrationReadManyDetailedAction({
        eventId: x.details.eventId,
        take: x.page.pageSize,
        skip: (x.page.page * x.page.pageSize) || undefined,
        type: x.details.type,
    })
    return registrations
}

export const EventRegistrationDetailedPagingContext =
    generatePagingContext<EventRegistrationDetailedExpanded, number, PageSizeUsers, EventRegistrationFetcherDetails>()
const EventRegistrationDetailedPagingProvider = generatePagingProvider({
    Context: EventRegistrationDetailedPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length),
})
export default EventRegistrationDetailedPagingProvider
