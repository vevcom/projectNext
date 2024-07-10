import styles from './GroupSelector.module.scss'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import type { ExpandedGroup } from '@/server/groups/Types'

type PropTypes = {
    group: ExpandedGroup
}

export default function GroupSelector({ group }: PropTypes) {
    return (
        <Link className={styles.GroupSelector} href={`/admin/groups/${group.id}`}>
            <FontAwesomeIcon icon={faArrowRight} />
        </Link>
    )
}
