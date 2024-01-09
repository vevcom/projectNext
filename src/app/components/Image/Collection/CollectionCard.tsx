import Link from 'next/link'
import styles from './CollectionCard.module.scss'
import Image from '@/components/Image/Image'
import type { Image as ImageT, ImageCollection } from '@prisma/client'


type PropTypes = {
    collection: ImageCollection & {
        coverImage: ImageT | null,
        numberOfImages: number,
    },
}

export default function CollectionCard({ collection }: PropTypes) {
    return (
        <Link href={`/images/collections/${collection.id}`} className={styles.CollectionCard} key={collection.id}>
            {
                collection.coverImage ? (
                    <Image width={100} image={collection.coverImage} />
                ) : (
                    <p>Something went wrong</p>
                )
            }
            <div className={styles.info}>
                <h2>{collection.name}</h2>
                <i>{collection.description}</i>
                <p>{collection.createdAt.toLocaleDateString()}</p>
            </div>
            <p className={styles.imageCount}>{collection.numberOfImages}</p>
        </Link>
    )
}
