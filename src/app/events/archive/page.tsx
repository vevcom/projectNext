import { readEventTagsAction } from '@/actions/events/tags/read'
import EventArchiveList from './EventArchiveList'
import EventsLandingLayout from '@/app/events/EventsLandingLayout'
import EventArchivePagingProvider from '@/contexts/paging/EventArchivePaging'
import { QueryParams } from '@/lib/query-params/queryParams'
import { SearchParamsServerSide } from '@/lib/query-params/Types'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { CreateEventTagAuther, DestroyEventTagAuther, UpdateEventTagAuther } from '@/services/events/tags/Authers'
import TagHeaderItem from '../TagHeaderItem'

type PropTypes = SearchParamsServerSide

export default async function EventArchive({
    searchParams
}: PropTypes) {
    const selectedTagNames = QueryParams.eventTags.decode(searchParams)
    const eventTagsResponse = await readEventTagsAction.bind(null, {})()
    if (!eventTagsResponse.success) {
        throw new Error('Failed to read current events')
    }
    const { data: eventTags, session } = eventTagsResponse
    const selectedTags = selectedTagNames ? eventTags.filter(tag => selectedTagNames.includes(tag.name)) : []

    const canUpdate = UpdateEventTagAuther.dynamicFields({}).auth(session)
    const canCreate = CreateEventTagAuther.dynamicFields({}).auth(session)
    const canDestroy = DestroyEventTagAuther.dynamicFields({}).auth(session)

    return (
        <EventsLandingLayout title="Hvad Der Har Hendt" headerLinks={[
            {
                href: selectedTagNames?.length ? `/events${QueryParams.eventTags.encodeUrl(selectedTagNames)}` : '/events',
                icon: faArrowLeft
            }
        ]} headerItem={
            <TagHeaderItem 
                canCreate={canCreate.authorized} 
                canUpdate={canUpdate.authorized} 
                canDestroy={canDestroy.authorized}
                currentTags={selectedTags} 
                eventTags={eventTags}
                page='EVENT_ARCHIVE'
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
