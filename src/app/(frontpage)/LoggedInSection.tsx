import styles from './LoggedInSection.module.scss'
import React from 'react'
import Link from 'next/link'

export default function LoggedInSection({
    title,
    link,
    layout = 'grid',
    children,
}: {
    title: string,
    link: string,
    /** 'rows' stacks full-width children instead of laying them out as a card grid. */
    layout?: 'grid' | 'rows',
    children: React.ReactNode,
}) {
    return <div className={styles.LoggedInSection}>
        <div className={styles.title}>
            <h4>{title}</h4>
            <Link href={link}>Les mer</Link>
        </div>
        <hr />
        <div className={`${styles.content} ${layout === 'rows' ? styles.rows : ''}`}>
            {children}
        </div>
    </div>
}
