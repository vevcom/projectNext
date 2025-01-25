import EventArchiveList from './EventArchiveList'
import TagHeaderItem from '@/app/events/TagHeaderItem'
import { readEventTagsAction } from '@/actions/events/tags/read'
import EventsLandingLayout from '@/app/events/EventsLandingLayout'
import EventArchivePagingProvider from '@/contexts/paging/EventArchivePaging'
import { QueryParams } from '@/lib/query-params/queryParams'
import { createEventTagAuther, destroyEventTagAuther, updateEventTagAuther } from '@/services/events/tags/authers'
import { Session } from '@/auth/Session'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import type { SearchParamsServerSide } from '@/lib/query-params/Types'

type PropTypes = SearchParamsServerSide

export default async function EventArchive({
    searchParams
}: PropTypes) {
    const selectedTagNames = QueryParams.eventTags.decode(searchParams)
    const eventTagsResponse = await readEventTagsAction()
    if (!eventTagsResponse.success) {
        throw new Error('Failed to read current events')
    }
    const { data: eventTags } = eventTagsResponse
    const selectedTags = selectedTagNames ? eventTags.filter(tag => selectedTagNames.includes(tag.name)) : []

    const session = await Session.fromNextAuth()

    const canUpdate = updateEventTagAuther.dynamicFields({}).auth(session)
    const canCreate = createEventTagAuther.dynamicFields({}).auth(session)
    const canDestroy = destroyEventTagAuther.dynamicFields({}).auth(session)

    return (
        <EventsLandingLayout page="EVENT_ARCHIVE" title="Hvad Der Har Hendt" headerLinks={[
            {
                href: selectedTagNames?.length ? `/events?${QueryParams.eventTags.encodeUrl(selectedTagNames)}` : '/events',
                icon: faArrowLeft
            }
        ]} headerItem={
            <TagHeaderItem
                canCreate={canCreate.authorized}
                canUpdate={canUpdate.authorized}
                canDestroy={canDestroy.authorized}
                currentTags={selectedTags}
                eventTags={eventTags}
                page="EVENT_ARCHIVE"
            />
        } selectedTags={selectedTags}>
            <EventArchivePagingProvider serverRenderedData={[]} startPage={{
                page: 0,
                pageSize: 12
            }} details={{ tags: QueryParams.eventTags.decode(searchParams) }}>
                <EventArchiveList />
            </EventArchivePagingProvider>
        </EventsLandingLayout>
    )
}
