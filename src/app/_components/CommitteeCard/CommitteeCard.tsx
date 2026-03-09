import styles from './CommitteeCard.module.scss'
import Image from '@/components/Image/Image'
import Link from 'next/link'
import type { Image as ImageT } from '@/prisma-generated-pn-types'
import type { ReactNode } from 'react'

type PropTypes = {
    image: ImageT | null,
    title: string,
    children?: ReactNode,
    href: string
}

export default function CommitteeCard({ image, title, children, href }: PropTypes) {
    return (
        <Link href={href} className={styles.CommitteeCard}>
            <div className={styles.image}>
                {
                    image && (
                        <Image width={240} image={image} />
                    )
                }
            </div>
            <div className={styles.content}>
                <h2>{title}</h2>
                {children}
            </div>
        </Link>
    )
}
