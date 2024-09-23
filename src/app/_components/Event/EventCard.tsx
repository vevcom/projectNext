import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faUsers } from '@fortawesome/free-solid-svg-icons'
import styles from './EventCard.module.scss'
import type { EventFilteredWithImage } from '@/services/events/Types'
import Link from 'next/link'
import Image from '@/components/Image/Image'

type PropTypes = {
    event: EventFilteredWithImage
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
            <h2>{event.name}</h2>
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
