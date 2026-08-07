import styles from './CollectionCard.module.scss'
import Image from '@/components/Image/Image'
import type { ExpandedImageCollection } from '@/services/images/subservice/types'

type PropTypes = {
    collection: ExpandedImageCollection,
    className?: string,
}

export default function CollectionCard({ collection, className }: PropTypes) {
    return (
        <div className={`${styles.CollectionCard} ${collection.special ? styles.special : ''} ${className ?? ''}`}>
            {
                collection.coverImage ? (
                    <Image smallSize width={100} image={collection.coverImage} />
                ) : (
                    <p>Something went wrong</p>
                )
            }
            {collection.special && <p className={styles.specialTag}>Spesiell</p>}
            <div className={styles.info}>
                <h2>{collection.name}</h2>
                <i>{collection.description}</i>
                <p>{collection.createdAt.toUTCString().split(' ').slice(0, 4).join(' ')}</p>
            </div>
            <p className={styles.imageCount}>{collection.numberOfImages}</p>
        </div>
    )
}
