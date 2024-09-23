import styles from './EventsLandingLayout.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import type { ReactNode } from 'react'

type PropTypes = {
    headerLinks: {
        href: string,
        icon: IconDefinition
    }[],
    headerItem: ReactNode,
    title: string,
    children: ReactNode
}

export default function EventsLandingLayout({
    headerItem,
    headerLinks,
    title,
    children
}: PropTypes) {
    return (
        <div className={styles.EventsLandingLayout}>
            <div className={styles.top}>
                <h1>{title}</h1>
                <div className={styles.navButtons}>
                    {
                        headerLinks.map(item =>
                            <Link href={item.href} key={item.href}>
                                <FontAwesomeIcon icon={item.icon} />
                            </Link>
                        )
                    }
                    {headerItem}
                </div>
            </div>

            <main>
                {children}
            </main>
        </div>
    )
}
