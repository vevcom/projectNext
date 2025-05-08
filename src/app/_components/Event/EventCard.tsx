import SmallEventTag from './SmallEventTag'
import styles from './EventCard.module.scss'
import ImageCard from '@/components/ImageCard/ImageCard'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faUsers } from '@fortawesome/free-solid-svg-icons'
import type { EventExpanded } from '@/services/events/Types'

export default function EventCard({ event }: {
    event: EventExpanded,
}) {
    return <ImageCard
        href={`/events/${event.order}/${event.name}`}
        title={event.name}
        image={event.coverImage.image}
    >
        <ul className={styles.tags}>
            {event.tags.map(tag => (

                <li key={tag.id}>
                    <SmallEventTag eventTag={tag} />
                </li>
            ))}
        </ul>
        <ul>
            <li>
                <FontAwesomeIcon icon={faCalendar} />
                {event.eventStart.toLocaleDateString()} - {event.eventEnd.toLocaleDateString()}
            </li>
            {
                event.takesRegistration ? (
                    <>
                        <li>
                            <FontAwesomeIcon icon={faUsers} />
                            {event._count.eventRegistrations} / {event.places}
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faCalendar} />
                            {event.registrationStart.toLocaleDateString()} - {event.registrationEnd.toLocaleDateString()}
                        </li>
                    </>
                ) : <></>
            }
        </ul>
    </ImageCard>
}
