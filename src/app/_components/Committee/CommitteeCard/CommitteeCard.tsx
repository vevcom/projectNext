import styles from './CommitteeCard.module.scss'
import Image from '@/components/Image/Image'
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
                            <Image width={128} image={image} hideCopyRight />
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
