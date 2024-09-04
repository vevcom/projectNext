import styles from './CommitteeCard.module.scss'
import Link from 'next/link'
import type { ReactNode } from 'react'

type PropTypes = {
    title: string,
    children?: ReactNode,
    href: string
}

export default function CommitteeCard({title, children, href }: PropTypes) {
    return (
        <Link href={href} className={styles.CommitteeMeny}>
            <div className={styles.content}>
                <h2>{title}</h2>
                {children}
            </div>
        </Link>
    )
}