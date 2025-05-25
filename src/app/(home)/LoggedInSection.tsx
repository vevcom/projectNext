import styles from './LoggedInSection.module.scss'
import React from 'react'
import Link from 'next/link'

export default function LoggedInSection({
    title,
    link,
    children,
}: {
    title: string,
    link: string,
    children: React.ReactNode,
}) {
    return <div className={styles.LoggedInSection}>
        <div className={styles.title}>
            <h4>{title}</h4>
            <Link href={link}>Les mer</Link>
        </div>
        <hr />
        <div className={styles.content}>
            {children}
        </div>
    </div>
}
