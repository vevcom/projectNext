import styles from './CollectionCard.module.scss'
import Image from '@/components/Image/Image'
import Link from 'next/link'
import type { Image as ImageT, ImageCollection } from '@/prisma-generated-pn-types'

type PropTypes = {
    collection: ImageCollection & {
        coverImage: ImageT | null,
        numberOfImages: number,
    },
    className?: string,
}

export default function CollectionCard({ collection, className }: PropTypes) {
    return (
        <Link
            href={`/images/collections/${collection.id}`}
            className={`${styles.CollectionCard} ${className}`}
            key={collection.id}
        >
            {
                collection.coverImage ? (
                    <Image smallSize width={100} image={collection.coverImage} />
                ) : (
                    <p>Something went wrong</p>
                )
            }
            <div className={styles.info}>
                <h2>{collection.name}</h2>
                <i>{collection.description}</i>
                <p>{collection.createdAt.toUTCString().split(' ').slice(0, 4).join(' ')}</p>
            </div>
            <p className={styles.imageCount}>{collection.numberOfImages}</p>
        </Link>
    )
}
