import SmallEventTag from './SmallEventTag'
import styles from './EventCard.module.scss'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'
import { updateEventCmsCoverImageAction } from '@/services/events/actions'
import { configureAction } from '@/services/configureAction'
import { formatVevenUri } from '@/lib/urlEncoding'
import React from 'react'
import Link from 'next/link'
import type { EventExpanded } from '@/services/events/types'
import type { ExpandedCmsImage } from '@/cms/images/types'
import type { AuthResultTypeAny } from '@/auth/authorizer/AuthResult'

type PropTypes = {
    event: EventExpanded
    canEdit: AuthResultTypeAny
}

const months = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des']

const twoDigitHour = (date: Date) => String(date.getHours()).padStart(2, '0')

export default function EventCard({ event, canEdit }: PropTypes) {
    const attendanceRatio = event.places > 0 ? event.numOfRegistrations / event.places : 0
    const attendance = `${Math.max(0, Math.min(attendanceRatio, 1)) * 100}%`
    const link = `/events/${formatVevenUri(`${event.name}`, event.id)}`
    const from = event.takesRegistration ? event.registrationStart : event.eventStart
    const to = event.takesRegistration ? event.registrationEnd : event.eventEnd

    return <Link href={link} className={styles.EventWrapper}>
        <div className={styles.thumb}>
            <CmsImage
                width={200}
                cmsImage={event.coverImage as ExpandedCmsImage}
                updateCmsImageAction={configureAction(
                    updateEventCmsCoverImageAction,
                    { implementationParams: { eventId: event.id } }
                )}
                canEdit={canEdit}
            />
        </div>

        <div className={styles.lead}>
            <b>{event.eventStart.getDate()}</b>
            <span>{months[event.eventStart.getMonth()]}</span>
        </div>

        <div className={styles.main}>
            <h2>{event.name}</h2>
            <div className={styles.tags}>
                {event.tags.map(tag => (
                    <SmallEventTag key={tag.id} eventTag={tag} />
                ))}
            </div>
        </div>

        <div className={styles.meta}>
            {event.location && <span>{event.location}</span>}
            <span>{twoDigitHour(from)}–{twoDigitHour(to)}</span>
            {event.takesRegistration && (
                <span className={styles.registrations}>{event.numOfRegistrations} / {event.places}</span>
            )}
        </div>

        {event.takesRegistration && (
            <div className={styles.bar}>
                <div style={{ width: attendance }}></div>
            </div>
        )}
    </Link>
}
