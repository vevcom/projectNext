'use client'
import EventCard from '@/components/Event/EventCard'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import { EventArchivePagingContext } from '@/contexts/paging/EventArchivePaging'
import type { AuthResultTypeAny } from '@/auth/authorizer/AuthResult'

type PropTypes = {
    canEdit: AuthResultTypeAny
}

export default function EventArchiveList({ canEdit }: PropTypes) {
    return (
        <EndlessScroll pagingContext={EventArchivePagingContext} renderer={event =>
            <EventCard key={event.id} event={event} canEdit={canEdit} />
        } />
    )
}
