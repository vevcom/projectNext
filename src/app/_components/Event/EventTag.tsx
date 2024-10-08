import Link from 'next/link'
import styles from './EventTag.module.scss'
import type { EventTag } from '@prisma/client'
import { QueryParams } from '@/lib/query-params/queryParams'

type PropTypes = {
    eventTag: EventTag
}

export default function EventTag({ eventTag }: PropTypes) {
    // if background color is too dark color of text should be white
    const textColor = (eventTag.colorR * 0.299 + eventTag.colorG * 0.587 + eventTag.colorB * 0.114) > 100 ? 'black' : 'white'
    return (
        <Link className={styles.EventTag} style={{
            color: textColor,
            backgroundColor: `rgb(${eventTag.colorR}, ${eventTag.colorG}, ${eventTag.colorB})`
        }} href={'/events' + QueryParams.eventTags.encodeUrl([eventTag.name])}>
            <p className={styles.name}>{eventTag.name}</p>
            <p className={styles.description}>
                {eventTag.description}
            </p>
        </Link>
    )
}
