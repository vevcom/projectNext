import styles from './page.module.scss'
import CreateOrUpdateEventForm from './CreateOrUpdateEventForm'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { readCurrentEvents } from '@/actions/events/read'
import EventCard from '@/components/Event/EventCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArchive, faTag } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export default async function Events() {
    const currentEventsResponse = await readCurrentEvents()
    if (!currentEventsResponse.success) {
        throw new Error('Failed to read current events')
    }
    const currentEvents = currentEventsResponse.data

    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <h1>Hvad Der Hender</h1>
                <div className={styles.navButtons}>
                    <Link href="/admin/eventtags">
                        <FontAwesomeIcon icon={faTag} />
                    </Link>
                    <Link href="/events/archive">
                        <FontAwesomeIcon icon={faArchive} />
                    </Link>
                    <AddHeaderItemPopUp PopUpKey="CreateEventPopUp">
                        <div className={styles.createEvent}>
                            <CreateOrUpdateEventForm />
                        </div>
                    </AddHeaderItemPopUp>
                </div>
            </div>
            
            <main>
            {
                currentEvents.map(event => 
                    <EventCard event={event} />
                )
            }
            </main>
        </div>
    )
}
