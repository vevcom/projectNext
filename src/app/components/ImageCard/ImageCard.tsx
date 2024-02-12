import { Image as ImageT } from '@prisma/client';
import styles from './ImageCard.module.scss';
import Image from '@/components/Image/Image';
import type { ReactNode } from 'react';

type PropTypes = {
    image: ImageT,
    title: string,
    children?: ReactNode,
}

export default function ImageCard({ image, title, children }: PropTypes) {
    return (
        <div className={styles.ImageCard}>
            <div className={styles.image}>
                <Image width={240} image={image} />
            </div>
            <div>
                <h3>{title}</h3>
                {children}
            </div>
        </div>
    )
}
