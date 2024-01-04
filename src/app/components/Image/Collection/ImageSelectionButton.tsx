import styles from './ImageSelectionButton.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import type { Image } from '@prisma/client'
import { ImageCollectionSelectImageContext } from '@/context/ImageCollectionSelectImage'
import { useContext } from 'react'

type PropTypes = {
    image: Image,
}

export default function ImageSelectionButton({image}: PropTypes) {
    const selection = useContext(ImageCollectionSelectImageContext)

    return (
        <div className={styles.ImageSelectionButton}>
            <button
                onClick={() => selection?.setSelectedImage(image)}
                className={styles.selectBtn + ' ' + (selection?.selectedImage?.id === image.id ? styles.selected : '')}
            >
                <FontAwesomeIcon icon={faCheck} />
            </button>
        </div>
    )
}
