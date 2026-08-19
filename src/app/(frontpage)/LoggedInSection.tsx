import styles from './LoggedInSection.module.scss'
import React from 'react'
import Link from 'next/link'

export default function LoggedInSection({
    title,
    link,
    layout = 'grid',
    span = 'full',
    children,
}: {
    title: string,
    link: string,
    /** 'rows' stacks full-width children instead of laying them out as a card grid. */
    layout?: 'grid' | 'rows',
    /** How much of the island row this section claims once there is room for two. */
    span?: 'full' | 'half',
    children: React.ReactNode,
}) {
    return <section className={`${styles.LoggedInSection} ${span === 'half' ? styles.half : ''}`}>
        <div className={styles.title}>
            <h4>{title}</h4>
            <Link href={link} className={styles.readMore}>Se flere</Link>
        </div>
        <div className={`${styles.content} ${layout === 'rows' ? styles.rows : ''}`}>
            {children}
        </div>
    </section>
}
