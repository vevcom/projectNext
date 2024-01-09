'use client'

import { useContext } from 'react'
import PopUp from '../PopUp/PopUp'
import { EditModeContext } from '@/context/EditMode'
import styles from './ImageLinkEditor.module.scss'
import { ImageLink, Image as ImageT } from '@prisma/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'

type PropTypes = {
    imageLink: ImageLink & {
        image: ImageT | null
    }
}


export default function ImageLinkEditor({imageLink}: PropTypes) {
    const editingContext = useContext(EditModeContext)
    if (!editingContext?.editMode) return null

    return (
        <PopUp showButtonContent={
            <FontAwesomeIcon icon={faPencil} className={styles.editIcon} />
        }>
            <div className={styles.ImageLinkEditor}>
                ImageLinkEditor
            </div>
        </PopUp>
    )
}
