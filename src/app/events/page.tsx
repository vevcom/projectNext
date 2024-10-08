import styles from './page.module.scss'
import CreateOrUpdateEventForm from './CreateOrUpdateEventForm'
import EventsLandingLayout from './EventsLandingLayout'
import { AddHeaderItemPopUp, TagHeasderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { readCurrentEvents } from '@/actions/events/read'
import EventCard from '@/components/Event/EventCard'
import EventTagsAdmin from '@/app/_components/Event/EventTagsAdmin'
import { readEventTagsAction } from '@/actions/events/tags/read'
import { CreateEventTagAuther, UpdateEventTagAuther } from '@/services/events/tags/Authers'
import PopUpProvider from '@/contexts/PopUp'
import { faArchive } from '@fortawesome/free-solid-svg-icons'

export default async function Events() {
    const currentEventsResponse = await readCurrentEvents()
    const eventTagsResponse = await readEventTagsAction.bind(null, {})()
    if (!currentEventsResponse.success || !eventTagsResponse.success) {
        throw new Error('Failed to read current events')
    }
    const { data: currentEvents } = currentEventsResponse
    const { data: eventTags, session } = eventTagsResponse

    const canUpdate = UpdateEventTagAuther.dynamicFields({}).auth(session)
    const canCreate = CreateEventTagAuther.dynamicFields({}).auth(session)

    return (
        <EventsLandingLayout title="Hvad Der Hender" headerLinks={[
            {
                href: '/events/archive',
                icon: faArchive
            },
        ]}
        headerItem={
            <>
                <TagHeasderItemPopUp scale={35} PopUpKey="TagEventPopUp">
                    <PopUpProvider>
                        <EventTagsAdmin
                            canCreate={canCreate.authorized}
                            canUpdate={canUpdate.authorized}
                            eventTags={eventTags}
                        />
                    </PopUpProvider>
                </TagHeasderItemPopUp>
                <AddHeaderItemPopUp PopUpKey="CreateEventPopUp">
                    <div className={styles.createEvent}>
                        <CreateOrUpdateEventForm />
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
