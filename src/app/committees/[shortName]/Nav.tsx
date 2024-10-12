'use client'

import Link from 'next/link'
import styles from './Nav.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCog, faInfo, faUsers } from '@fortawesome/free-solid-svg-icons'
import { usePathname } from 'next/navigation'

type PropTypes = {
    shortName: string
}

export default function Nav({ shortName }: PropTypes) {
    const pathname = usePathname()
    console.log(pathname)

    const adminPath = `/committees/${shortName}/admin`
    const membersPath = `/committees/${shortName}/members`
    const aboutPath = `/committees/${shortName}/about`

    return (
        <div className={styles.Nav}>
            <Link className={pathname === adminPath ? styles.selected : undefined} href={adminPath}>
                <FontAwesomeIcon icon={faCog} />
            </Link>
            <Link className={pathname === membersPath ? styles.selected : undefined} href={membersPath}>
                <FontAwesomeIcon icon={faUsers} />
            </Link>
            <Link className={pathname === aboutPath ? styles.selected : undefined} href={aboutPath}>
                <FontAwesomeIcon icon={faInfo} />
            </Link>
            <Link href={
                pathname === `/committees/${shortName}` ? '/committees' : `/committees/${shortName}`
            }>
                <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
        </div>
    )
}
