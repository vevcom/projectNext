import { faTag } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { EventTag } from "@prisma/client"
import styles from './SmallEventTag.module.scss'

type PropTypes = {
    eventTag: EventTag
}

export default function SmallEventTag({ eventTag }: PropTypes) {
    return (
        <div className={styles.SmallEventTag} style={{
            color: `rgb(${eventTag.colorR}, ${eventTag.colorG}, ${eventTag.colorB})`
        }}>
            <FontAwesomeIcon icon={faTag} />
            <p>{eventTag.name}</p>
        </div>
    )
}
