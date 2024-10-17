'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { faCircleDot, faCog, faKey, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import styles from './Nav.module.scss'
import { usePathname } from 'next/navigation'

type PropTypes = {
    username: string
}

export default function Nav({ username }: PropTypes) {
    const pathname = usePathname()
    const page = pathname.split('/').pop()
    return (
        <aside className={styles.Nav}>
            <Link href={`/users/${username}/dots`} className={page === 'dots' ? styles.selected : undefined}>
                <FontAwesomeIcon icon={faCircleDot} />
            </Link>
            <Link href={`/users/${username}/notifications`} className={page === 'notifications' ? styles.selected : undefined}>
                <FontAwesomeIcon icon={faPaperPlane} />
            </Link>
            <Link href={`/users/${username}/permissions`} className={page === 'permissions' ? styles.selected : undefined}>
                <FontAwesomeIcon icon={faKey} />
            </Link>
            <Link href={`/users/${username}/settings`} className={page === 'settings' ? styles.selected : undefined}>
                <FontAwesomeIcon icon={faCog} />
            </Link>
        </aside>
    )
}
