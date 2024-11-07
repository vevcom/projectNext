'use client'
import styles from './BackButton.module.scss'
import Link from 'next/link'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname } from 'next/navigation'

type PropTypes = {
    className?: string
}

/**
 * Component that navigates back to the previous page.
 */
export default function BackButton({ className }: PropTypes) {
    const pathname = usePathname()
    const href = `/${pathname?.split('/').slice(1, -1).join('/')}`

    return (
        <Link className={`${styles.BackButton} ${className}`} href={href}>
            <FontAwesomeIcon icon={faArrowLeft} className={styles.icon}/>
        </Link>
    )
}
