'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readManyEventRegistrationAction } from '@/actions/events/registration'
import type { EventRegistrationDetails, EventRegistrationExpanded } from '@/services/events/registration/Types'
import type { PageSizeUsers } from './UserPaging'
import type { ReadPageInput } from '@/lib/paging/Types'

const fetcher = async (x: ReadPageInput<PageSizeUsers, number, EventRegistrationDetails>) => {
    const registrations = await readManyEventRegistrationAction({
        eventId: 1,
        take: 50,
        skip: x.page.cursor || undefined,
    })
    return registrations
}

export const EventRegistrationPagingContext =
    generatePagingContext<EventRegistrationExpanded, number, PageSizeUsers, EventRegistrationDetails>()
const EventRegistrationPagingProvider = generatePagingProvider({
    Context: EventRegistrationPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length),
})
export default EventRegistrationPagingProvider
