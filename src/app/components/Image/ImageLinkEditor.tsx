'use client'

import { useContext } from 'react'
import PopUp from '../PopUp/PopUp'
import { EditModeContext } from '@/context/EditMode'
import styles from './ImageLinkEditor.module.scss'


export default function ImageLinkEditor() {
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
