import styles from './EventsLandingLayout.module.scss'
import EventTag from '@/components/Event/EventTag'
import { QueryParams } from '@/lib/query-params/queryParams'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import type { EventTag as EventTagT } from '@prisma/client'
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
    selectedTags?: EventTagT[]
}

export default function EventsLandingLayout({
    headerItem,
    headerLinks,
    title,
    selectedTags,
    children
}: PropTypes) {
    return (
        <div className={styles.EventsLandingLayout}>
            <div className={styles.top}>
                <div className={styles.titleAndTags}>
                    <h1>{title}</h1>
                    {
                        selectedTags?.map(tag =>
                            <Link key={tag.name} href={selectedTags.length === 1 ? '/events' :
                                `/events/${QueryParams.eventTags.encodeUrl(
                                    selectedTags.filter(t => t.name !== tag.name).map(t => t.name)
                                )}`
                            }>
                                <EventTag eventTag={tag} />
                            </Link>
                        )
                    }
                </div>
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
