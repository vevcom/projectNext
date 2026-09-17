import styles from './CommitteeCard.module.scss'
import CommitteeLogo from '@/components/Committee/CommitteeLogo/CommitteeLogo'
import Link from 'next/link'
import type { ExpandedImage } from '@/services/images/subservice/types'
import type { ReactNode } from 'react'

type PropTypes = {
    image: ExpandedImage | null,
    title: string,
    children?: ReactNode,
    href: string
}

export default function CommitteeCard({ image, title, children, href }: PropTypes) {
    return (
        <div className={styles.CommitteeCard}>
            <Link href={href} className={styles.mainLink}>
                <div className={styles.image}>
                    {
                        image && (
                            <CommitteeLogo width={128} logoImage={image} />
                        )
                    }
                </div>
                <div className={styles.content}>
                    <h2>{title}</h2>
                    {children}
                </div>
            </Link>
        </div>
    )
}
