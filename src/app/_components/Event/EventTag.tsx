import type { EventTag } from "@prisma/client"
import styles from './EventTag.module.scss'

type PropTypes = {
    eventTag: EventTag
}

export default function EventTag({ eventTag }: PropTypes) {
    return (
        <div className={styles.EventTag} style={{
            color: `rgb(${eventTag.colorR}, ${eventTag.colorG}, ${eventTag.colorB})`
        }}>
            {eventTag.name}
            <div className={styles.description}>
                {eventTag.description}
            </div>
        </div>
    )
}
