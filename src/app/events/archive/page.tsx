import EventArchiveList from './EventArchiveList'
import TagHeaderItem from '@/app/events/TagHeaderItem'
import { readEventTagsAction } from '@/services/events/tags/actions'
import EventsLandingLayout from '@/app/events/EventsLandingLayout'
import { EventArchivePagingProvider } from '@/contexts/paging/EventArchivePaging'
import { ServerSession } from '@/auth/session/ServerSession'
import { QueryParams } from '@/lib/queryParams/queryParams'
import { eventTagAuth } from '@/services/events/tags/auth'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import type { SearchParamsServerSide } from '@/lib/queryParams/types'

type PropTypes = SearchParamsServerSide

export default async function EventArchive({
    searchParams
}: PropTypes) {
    const selectedTagNames = QueryParams.eventTags.decode(await searchParams)
    const eventTagsResponse = await readEventTagsAction()
    if (!eventTagsResponse.success) {
        throw new Error('Failed to read current events')
    }
    const { data: eventTags } = eventTagsResponse
    const selectedTags = selectedTagNames ? eventTags.filter(tag => selectedTagNames.includes(tag.name)) : []

    const session = await ServerSession.fromNextAuth()

    const canUpdate = eventTagAuth.update.dynamicFields({}).auth(session)
    const canCreate = eventTagAuth.create.dynamicFields({}).auth(session)
    const canDestroy = eventTagAuth.destroy.dynamicFields({}).auth(session)

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
            }} details={{ tags: QueryParams.eventTags.decode(await searchParams) }}>
                <EventArchiveList />
            </EventArchivePagingProvider>
        </EventsLandingLayout>
    )
}
