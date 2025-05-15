'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readManyEventRegistrationAction } from '@/actions/events/registration'
import type { EventRegistrationExpanded, EventRegistrationFetcherDetails } from '@/services/events/registration/Types'
import type { PageSizeUsers } from './UserPaging'
import type { ReadPageInput } from '@/lib/paging/Types'

const fetcher = async (x: ReadPageInput<PageSizeUsers, number, EventRegistrationFetcherDetails>) => {
    const registrations = await readManyEventRegistrationAction({
        eventId: x.details.eventId,
        take: x.page.pageSize,
        skip: (x.page.page * x.page.pageSize) || undefined,
        type: x.details.type,
    })
    return registrations
}

export const EventRegistrationPagingContext =
    generatePagingContext<EventRegistrationExpanded, number, PageSizeUsers, EventRegistrationFetcherDetails>()
const EventRegistrationPagingProvider = generatePagingProvider({
    Context: EventRegistrationPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length),
})
export default EventRegistrationPagingProvider
