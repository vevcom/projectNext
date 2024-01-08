'use client'

import { useContext } from 'react'
import PopUp from '../PopUp/PopUp'
import { EditModeContext } from '@/context/EditMode'
import styles from './ImageLinkEditor.module.scss'
import { ImageLink, Image as ImageT } from '@prisma/client'

type PropTypes = {
    imageLink: ImageLink & {
        image: ImageT | null
    }
}


export default function ImageLinkEditor({imageLink}: PropTypes) {
    const editingContext = useContext(EditModeContext)
    if (!editingContext) return null

    return (
        <PopUp showButtonContent={
            <>open button</>
        }>
            <div className={styles.ImageLinkEditor}>
                ImageLinkEditor
            </div>
        </PopUp>
    )
}
