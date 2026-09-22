import styles from './ArchiveLink.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArchive } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

type PropTypes = {
    href: string
}

/**
 * A header item link to a page's archive, styled to match the pill buttons
 * from HeaderItemPopUp (e.g. AddHeaderItemPopUp's "Ny" button).
 */
export default function ArchiveLink({ href }: PropTypes) {
    return (
        <Link href={href} className={styles.ArchiveLink}>
            <span>Arkiv</span>
            <FontAwesomeIcon icon={faArchive} />
        </Link>
    )
}
