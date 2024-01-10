'use client'
import React, { useContext } from 'react'
import styles from './ChangeImage.module.scss'
import type { Image as ImageT } from '@prisma/client'
import Image from '../Image'
import { ImageSelectionContext } from '@/context/ImageSelection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTurnUp } from '@fortawesome/free-solid-svg-icons'

type PropTypes = {
    currentImage: ImageT
}

export default function ChangeImage({ currentImage } : PropTypes) {
    const selectedContext = useContext(ImageSelectionContext)
    if (!selectedContext) throw new Error('ImageSelectionContext required to use ChangeImage')

    return (
        <div className={styles.ChangeImage}>
            {
                selectedContext?.selectedImage ? (
                    <div className={styles.currentAndSelected}>
                        <div className={styles.imageClip}>
                            <Image width={200} image={currentImage} />
                        </div>
                        <div className={styles.imageClip}>
                            <Image width={200} image={selectedContext.selectedImage} />
                        </div>
                        <FontAwesomeIcon className={styles.arrow1} icon={faTurnUp} />
                        <FontAwesomeIcon className={styles.arrow2} icon={faTurnUp} />
                    </div>
                ) : (
                    <div className={`${styles.onlyCurrent} ${styles.imageClip}`}>
                        <Image width={200} image={currentImage} />
                    </div>
                )
            }
            
            <i>image name: {currentImage.name}</i>
        </div>
    )
}
