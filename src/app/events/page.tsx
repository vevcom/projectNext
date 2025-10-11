import styles from './page.module.scss'
import CreateOrUpdateEventForm from './CreateOrUpdateEventForm'
import EventsLandingLayout from './EventsLandingLayout'
import TagHeaderItem from './TagHeaderItem'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { readCurrentEventsAction } from '@/services/events/actions'
import EventCard from '@/components/Event/EventCard'
import { readEventTagsAction } from '@/services/events/tags/actions'
import { eventTagAuth } from '@/services/events/tags/auth'
import { QueryParams } from '@/lib/queryParams/queryParams'
import { Session } from '@/auth/session/Session'
import { faArchive } from '@fortawesome/free-solid-svg-icons'
import type { SearchParamsServerSide } from '@/lib/queryParams/types'

type PropTypes = SearchParamsServerSide

export default async function Events({
    searchParams
}: PropTypes) {
    const tagNames = QueryParams.eventTags.decode(await searchParams)

    const currentEventsResponse = await readCurrentEventsAction({ params: { tags: tagNames } })
    const eventTagsResponse = await readEventTagsAction()

    if (!currentEventsResponse.success) {
        throw new Error('Failed to read current events')
    }
    if (!eventTagsResponse.success) {
        throw new Error('Failed to read event tags')
    }
    const { data: currentEvents } = currentEventsResponse
    const { data: eventTags } = eventTagsResponse

    const currentTags = tagNames ? eventTags.filter(tag => tagNames.includes(tag.name)) : []

    const session = await Session.fromNextAuth()

    const canUpdate = eventTagAuth.update.dynamicFields({}).auth(session)
    const canCreate = eventTagAuth.create.dynamicFields({}).auth(session)
    const canDestroy = eventTagAuth.destroy.dynamicFields({}).auth(session)

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
