'use client'
import styles from './ImageSelectionButton.module.scss'
import { ImageSelectionContext } from '@/contextss/ImageSelection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import type { Image } from '@prisma/client'

type PropTypes = {
    image: Image,
}

export default function ImageSelectionButton({ image }: PropTypes) {
    const selection = useContext(ImageSelectionContext)
    const imageIsSelected = selection?.selectedImage?.id === image.id

    return (
        selection?.selectionMode && (
            <div className={styles.ImageSelectionButton}>
                <button
                    onClick={() => selection?.setSelectedImage(imageIsSelected ? null : image)}
                    className={`${styles.selectBtn} ${imageIsSelected ? styles.selected : ''}`}
                >
                    <FontAwesomeIcon icon={faCheck} />
                </button>
            </div>
        )
    )
}
