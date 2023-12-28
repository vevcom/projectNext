'use client'

import styles from './ImageCollectionDisplay.module.scss'
import Image from './Image'
import type { ImageCollection, Image as ImageT } from '@prisma/client'
import { Suspense, useState } from 'react'

type PropTypes = {
    collection: ImageCollection & {
        images: ImageT[],
    },
    startImageName?: string,
}

export default function ImageCollectionDisplay({collection, startImageName}: PropTypes) {
    const [currentId, setCurrentId] = useState(collection.images.findIndex(image => image.name === startImageName))

    return (
        <div className={styles.ImageCollectionDisplay}>
            <div className={styles.currentImage}>
                <Suspense fallback={
                    <div className={styles.loading}></div>
                }>
                    <Image width={200} image={collection.images[currentId]} />
                </Suspense>
            </div>
            
        </div>
    )
}
