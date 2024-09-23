import styles from './page.module.scss'
import CreateOrUpdateEventForm from './CreateOrUpdateEventForm'
import EventsLandingLayout from './EventsLandingLayout'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { readCurrentEvents } from '@/actions/events/read'
import EventCard from '@/components/Event/EventCard'
import { faArchive, faTag } from '@fortawesome/free-solid-svg-icons'

export default async function Events() {
    const currentEventsResponse = await readCurrentEvents()
    if (!currentEventsResponse.success) {
        throw new Error('Failed to read current events')
    }
    const currentEvents = currentEventsResponse.data

    return (
        <EventsLandingLayout title="Hvad Der Hender" headerLinks={[
            {
                href: '/admin/eventtags',
                icon: faTag
            },
            {
                href: '/events/archive',
                icon: faArchive
            }
        ]}
        headerItem={
            <AddHeaderItemPopUp PopUpKey="CreateEventPopUp">
                <div className={styles.createEvent}>
                    <CreateOrUpdateEventForm />
                </div>
            </AddHeaderItemPopUp>
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
