import styles from './CollectionCard.module.scss'
import Image from '@/components/Image/Image'
import Link from 'next/link'
import type { ExpandedImageCollection } from '@/services/images/subservice/types'

type PropTypes = {
    collection: ExpandedImageCollection,
    className?: string,
}

export default function CollectionCard({ collection, className }: PropTypes) {
    const href = collection.special
        ? `/image-collections/special/${encodeURIComponent(collection.special)}`
        : `/image-collections/dynamic/${encodeURIComponent(collection.name)}`

    return (
        <Link
            href={href}
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
