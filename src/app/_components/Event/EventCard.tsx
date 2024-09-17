import React from 'react'
import ImageCard from '../ImageCard/ImageCard'
import { Event } from '@prisma/client'
import { ExpandedCmsImage } from '@/services/cms/images/Types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faUsers } from '@fortawesome/free-solid-svg-icons'

type PropTypes = {
    event: Event & {
        coverImage: Pick<ExpandedCmsImage, 'image'>
    }
}

export default function EventCard({ event }: PropTypes) {
    return (
        <ImageCard title={event.name} href={`/events/${event.order}/${event.name}`} image={event.coverImage.image}>
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
        </ImageCard>
    )
}
