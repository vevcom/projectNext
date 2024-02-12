import { Image as ImageT } from '@prisma/client';
import styles from './ImageCard.module.scss';
import Image from '@/components/Image/Image';
import type { ReactNode } from 'react';
import Link from 'next/link';

type PropTypes = {
    image: ImageT,
    title: string,
    children?: ReactNode,
    href: string
}

export default function ImageCard({ image, title, children, href }: PropTypes) {
    return (
        <Link href={href} className={styles.ImageCard}>
            <div className={styles.image}>
                <Image width={240} image={image} />
            </div>
            <div className={styles.content}>
                <h3>{title}</h3>
                {children}
            </div>
        </Link>
    )
}
