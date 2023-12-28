import styles from './ImageCollectionDisplay.module.scss'
import Image from './Image'
import prisma from '@/prisma'

type PropTypes = {
    collectionId: number,
    startImageName?: string,
}

export default async function ImageCollectionDisplay({collectionId, startImageName}: PropTypes) {
    const collection = await prisma.imageCollection.findUnique({
        where: {
            id: collectionId,
        },
        include: {
            images: true,
        },
    })

    return (
        collection ? (
            <div className={styles.ImageCollectionDisplay}>
                <Image width={200} name={startImageName || collection.images[0].name} />
            </div>
        ) : (
            <div className={styles.ImageCollectionDisplay}>
                <h1>Collection {collectionId} was not found</h1>
            </div>
        )
        
    )
}
