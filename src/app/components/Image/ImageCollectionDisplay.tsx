'use client'

import styles from './ImageCollectionDisplay.module.scss'
import Image from './Image'
import type { ImageCollection, Image as ImageT } from '@prisma/client'
import { Suspense, useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import useKeyPress from '@/hooks/useKeyPress'

type PropTypes = {
    collection: ImageCollection & {
        images: ImageT[],
    },
    startImageName?: string,
}

export default function ImageCollectionDisplay({ collection, startImageName }: PropTypes) {
    const [currentId, setCurrentId] = useState(collection.images.findIndex(image => image.name === startImageName))
    const goRight = useCallback(() => {
        setCurrentId(prev => (prev + 1) % collection.images.length)
    }, [currentId])
    const goLeft = useCallback(() => {
        setCurrentId(prev => (prev - 1 === -1 ? collection.images.length - 1 : prev - 1))
    }, [currentId])

    useKeyPress('ArrowRight', goRight)
    useKeyPress('ArrowLeft', goLeft)
    return (
        <div className={styles.ImageCollectionDisplay}>
            <div className={styles.currentImage}>
                <h2>{collection.images[currentId].name}</h2>
                <i>{collection.images[currentId].alt}</i>
                <Suspense fallback={
                    <div className={styles.loading}></div>
                }>
                    <Image width={200} image={collection.images[currentId]} />
                </Suspense>
            </div>

            <div className={styles.controls}>
                <button onClick={goLeft}>
                    <FontAwesomeIcon icon={faChevronLeft}/>
                </button>
                <button onClick={goRight}>
                    <FontAwesomeIcon icon={faChevronRight}/>
                </button>
            </div>
        </div>
    )
}
