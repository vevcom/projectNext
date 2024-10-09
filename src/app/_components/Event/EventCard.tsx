import styles from './EventCard.module.scss'
import Image from '@/components/Image/Image'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faUsers } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import type { EventExpanded } from '@/services/events/Types'
import SmallEventTag from './SmallEventTag'

type PropTypes = {
    event: EventExpanded
}

export default function EventCard({ event }: PropTypes) {
    return (
        <Link
            className={styles.EventCard}
            title={event.name}
            href={`/events/${event.order}/${event.name}`}
        >
            <div className={styles.coverImage}>
                {
                    event.coverImage.image ? <Image
                        image={event.coverImage.image}
                        width={300}
                    /> : <FontAwesomeIcon icon={faCalendar} />
                }
            </div>
            <div className={styles.topInfo}>
                <h2>{event.name}</h2>
                <ul className={styles.tags}>
                    {event.tags.map(tag => (
                        <li key={tag.id}>
                            <SmallEventTag eventTag={tag} />
                        </li>
                    ))}
                </ul>
            </div>
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
                                {0} / {event.places}
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCalendar} />
                                {event.registrationStart.toLocaleDateString()} - {event.registrationEnd.toLocaleDateString()}
                            </li>
                        </>
                    ) : <></>
                }
            </ul>
        </Link>
    )
}
