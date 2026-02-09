import SmallEventTag from './SmallEventTag'
import styles from './EventCard.module.scss'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'
import {updateEventCmsCoverImageAction} from "@/services/events/actions";
import React from 'react'
import type { EventExpanded } from '@/services/events/types'
import {configureAction} from "@/services/configureAction";

export default function EventCard({ event }: {
    event: EventExpanded,
}) {
    const attendance = `${event.numOfRegistrations / event.places * 100}%`
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    const link = `/events/${event.name}-${event.id}`
    return <a href={link} className={styles.EventWrapper}>
        <div className={styles.EventHeader}>
            <div className={styles.EventMainTime}>
                <b>{event.eventStart.getDate()}</b> - {months[event.eventStart.getMonth()]}
            </div>
            <div className={styles.tags}>
                {event.tags.map(tag => (

                    <div key={tag.id}>
                        <SmallEventTag eventTag={tag} />
                    </div>
                ))}
            </div>
        </div>

        <div className={styles.EventImage}>
            {
            /*    <CmsImage
                    width={200}
                    cmsImage={event.coverImage as ExpandedCmsImage}
                    updateCmsImageAction={
                        configureAction(
                            updateEventCmsCoverImageAction,
                            { implementationParams: { eventId: event.id } }
                        )}
                />*/
            }
        </div>
        <div className={styles.EventMain}>
            <h2>{event.name}</h2>
            <h4>{event.eventStart.toLocaleDateString()} - {event.eventEnd.toLocaleDateString()}</h4>
            <p>Event description</p>
        </div>
        <div className={styles.EventAttendanceBar}>
            {event.takesRegistration ? <>
                <div style={{ width: attendance }}></div>
            </> : <></>}
        </div>
        <div className={styles.EventFooter}>
            {event.takesRegistration ? <>
                <div>
                    {event.numOfRegistrations} / {event.places}
                </div>
            </> : <></>}
            <div>
                {event.location}
            </div>
            <div>
                kl. {event.registrationStart.getHours()} - {event.registrationEnd.getHours()}
            </div>
        </div>
    </a>
}
