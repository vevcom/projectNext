import SmallEventTag from './SmallEventTag'
import styles from './EventCard.module.scss'
import React from 'react'
import type { EventExpanded } from '@/services/events/types'

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
        <div className={styles.EventAttendanceBar}>
            {event.takesRegistration ? <>
                <div style={{ width: attendance }}></div>
            </> : <></>}
        </div>
        <div className={styles.EventImage}>
            {
                event.coverImage.image && (

                    <div></div>
                )
            }
        </div>
        <div className={styles.EventMain}>
            <h2>{event.name}</h2>
            <h4>{event.eventStart.toLocaleDateString()} - {event.eventEnd.toLocaleDateString()}</h4>
            <p>Event description</p>
        </div>
        <div className={styles.EventFooter}>
            <div>
                {event.numOfRegistrations} / {event.places}
            </div>
            <div>
                {event.places}
            </div>
            {event.takesRegistration ? <>
                <div>
                    kl. {event.registrationStart.getHours()} - {event.registrationEnd.getHours()}
                </div>
            </> : <></>}
        </div>
    </a>
}
