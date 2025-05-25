import styles from './ImageCard.module.scss'
import Image from '@/components/Image/Image'
import Link from 'next/link'
import type { Image as ImageT } from '@prisma/client'
import type { ReactNode } from 'react'

type PropTypes = {
    image: ImageT | null,
    title: string,
    children?: ReactNode,
    href: string,
    className?: string
}

export default function ImageCard({ image, title, children, href, className }: PropTypes) {
    return (
        <Link href={href} className={`${styles.ImageCard} ${className}`}>
            <div className={styles.image}>
                {
                    image && (
                        <Image
                            disableLinkingToLicense
                            creditPlacement="top"
                            width={240}
                            image={image}
                        />
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
