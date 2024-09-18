import React from 'react'
import { ExpandedCmsImage } from '@/services/cms/images/Types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faUsers } from '@fortawesome/free-solid-svg-icons'
import styles from './EventCard.module.scss'
import type { EventFiltered } from '@/services/events/Types'
import Link from 'next/link'
import Image from '@/components/Image/Image'

type PropTypes = {
    event: EventFiltered & {
        coverImage: Pick<ExpandedCmsImage, 'image'>
    }
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
                /> : <></>
            }
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
