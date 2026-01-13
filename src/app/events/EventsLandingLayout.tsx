import styles from './EventsLandingLayout.module.scss'
import EventTag from '@/components/Event/EventTag'
import { QueryParams } from '@/lib/queryParams/queryParams'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import type { EventTag as EventTagT } from '@/prisma-generated-pn-types'
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
    page: 'EVENT' | 'EVENT_ARCHIVE'
}

export default function EventsLandingLayout({
    headerItem,
    headerLinks,
    title,
    selectedTags,
    page,
    children
}: PropTypes) {
    const baseUrl = page === 'EVENT' ? '/events' : '/events/archive'
    return (
        <div className={styles.EventsLandingLayout}>
            <div className={styles.top}>
                <div className={styles.titleAndTags}>
                    <h1>{title}</h1>
                    {
                        selectedTags?.map(tag =>
                            <Link key={tag.name} href={selectedTags.length === 1 ? baseUrl :
                                `${baseUrl}?${QueryParams.eventTags.encodeUrl(
                                    selectedTags.filter(tagItem => tagItem.name !== tag.name).map(tagItem => tagItem.name)
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
