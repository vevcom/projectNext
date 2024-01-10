import React from 'react'
import styles from './ChangeImage.module.scss'
import type { Image as ImageT } from '@prisma/client'
import Image from '../Image'

type PropTypes = {
    currentImage: ImageT
}

export default function ChangeImage({ currentImage } : PropTypes) {
    return (
        <div className={styles.ChangeImage}>
            <div>
                <Image width={200} image={currentImage} />
            </div>
            <i>image name: {currentImage.name}</i>
        </div>
    )
}
