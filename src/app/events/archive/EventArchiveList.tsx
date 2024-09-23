'use client'
import EventCard from "@/components/Event/EventCard"
import EndlessScroll from "@/components/PagingWrappers/EndlessScroll"
import { EventArchivePagingContext } from "@/contexts/paging/EventArchivePaging"

export default function EventArchiveList() {
    return (
        <EndlessScroll pagingContext={EventArchivePagingContext} renderer={event => 
            <EventCard key={event.id} event={event} />
        } />
    )
}
