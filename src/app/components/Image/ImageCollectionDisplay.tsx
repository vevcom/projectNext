'use client'

import styles from './ImageCollectionDisplay.module.scss'
import Image from './Image'
import type { ImageCollection, Image as ImageT } from '@prisma/client'
import { useState } from 'react'

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
            <Image width={200} name={startImageName || collection.images[0].name} />
        </div>
    )
}
