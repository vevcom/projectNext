import styles from './page.module.scss'
import CreateOrUpdateEventForm from './CreateOrUpdateEventForm'
import EventsLandingLayout from './EventsLandingLayout'
import { AddHeaderItemPopUp, TagHeasderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { readCurrentEvents } from '@/actions/events/read'
import EventCard from '@/components/Event/EventCard'
import EventTagsAdmin from '@/app/_components/Event/EventTagsAdmin'
import { faArchive } from '@fortawesome/free-solid-svg-icons'
import { readEventTags } from '@/actions/events/tags/read'

export default async function Events() {
    const currentEventsResponse = await readCurrentEvents()
    const eventTagsResponse = await readEventTags.bind(null, {})()
    if (!currentEventsResponse.success || !eventTagsResponse.success) {
        throw new Error('Failed to read current events')
    }
    const currentEvents = currentEventsResponse.data
    const eventTags = eventTagsResponse.data

    return (
        <EventsLandingLayout title="Hvad Der Hender" headerLinks={[
            {
                href: '/events/archive',
                icon: faArchive
            },
        ]}
        headerItem={
            <>
            <TagHeasderItemPopUp PopUpKey="TagEventPopUp">
                <EventTagsAdmin eventTags={eventTags} />
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
