import styles from './page.module.scss'
import CreateOrUpdateEventForm from './CreateOrUpdateEventForm'
import EventsLandingLayout from './EventsLandingLayout'
import TagHeaderItem from './TagHeaderItem'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { readCurrentEventsAction } from '@/actions/events/read'
import EventCard from '@/components/Event/EventCard'
import { readEventTagsAction } from '@/actions/events/tags/read'
import { CreateEventTagAuther, DestroyEventTagAuther, UpdateEventTagAuther } from '@/services/events/tags/Authers'
import { QueryParams } from '@/lib/query-params/queryParams'
import { Session } from '@/auth/Session'
import { bindParams } from '@/actions/bindParams'
import { faArchive } from '@fortawesome/free-solid-svg-icons'
import type { SearchParamsServerSide } from '@/lib/query-params/Types'

type PropTypes = SearchParamsServerSide

export default async function Events({
    searchParams
}: PropTypes) {
    const tagNames = QueryParams.eventTags.decode(searchParams)

    const currentEventsResponse = await readCurrentEventsAction({ params: { tags: tagNames } })
    const eventTagsResponse = await readEventTagsAction()
    if (!currentEventsResponse.success || !eventTagsResponse.success) {
        throw new Error('Failed to read current events')
    }
    const { data: currentEvents } = currentEventsResponse
    const { data: eventTags } = eventTagsResponse

    const currentTags = tagNames ? eventTags.filter(tag => tagNames.includes(tag.name)) : []

    const session = await Session.fromNextAuth()

    const canUpdate = UpdateEventTagAuther.dynamicFields({}).auth(session)
    const canCreate = CreateEventTagAuther.dynamicFields({}).auth(session)
    const canDestroy = DestroyEventTagAuther.dynamicFields({}).auth(session)

    return (
        <EventsLandingLayout page="EVENT" title="Hvad Der Hender" headerLinks={[
            {
                href: tagNames?.length ? `/events/archive?${QueryParams.eventTags.encodeUrl(tagNames)}` : '/events/archive',
                icon: faArchive
            },
        ]}
        selectedTags={currentTags}
        headerItem={
            <>
                <TagHeaderItem
                    eventTags={eventTags}
                    currentTags={currentTags}
                    canUpdate={canUpdate.authorized}
                    canCreate={canCreate.authorized}
                    canDestroy={canDestroy.authorized}
                    page="EVENT"
                />
                <AddHeaderItemPopUp PopUpKey="CreateEventPopUp">
                    <div className={styles.createEvent}>
                        <CreateOrUpdateEventForm eventTags={eventTags} />
                    </div>
                </AddHeaderItemPopUp>
            </>
        }
        >
            {
                currentEvents.map(event =>
                    <EventCard event={event} key={event.id} />
                )
            }
        </EventsLandingLayout>
    )
}
