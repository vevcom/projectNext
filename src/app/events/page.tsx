import styles from './page.module.scss'
import CreateEventForm from './CreateEventForm'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { readCurrentEvents } from '@/actions/events/read'
import EventCard from '@/components/Event/EventCard'

export default async function Events() {
    const currentEventsResponse = await readCurrentEvents()
    if (!currentEventsResponse.success) {
        throw new Error('Failed to read current events')
    }
    const currentEvents = currentEventsResponse.data

    return (
        <div className={styles.wrapper}>
            <h1>Hvad Der Hender</h1>
            <AddHeaderItemPopUp PopUpKey="CreateEventPopUp">
                <div className={styles.createEvent}>
                    <CreateEventForm />
                </div>
            </AddHeaderItemPopUp>
            <ul>
            {
                currentEvents.map(event => 
                    <EventCard event={event} />
                )
            }
            </ul>
        </div>
    )
}
