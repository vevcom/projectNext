'use client'

import { createOmbul } from '@/actions/ombul/create'
import Form from '@/components/Form/Form'
import styles from './CreateOmbul.module.scss'
import { ImageSelectionContext } from '@/context/ImageSelection'
import { useContext } from 'react'

/**
 * This component is for creating ombul issues. Since it needs to be able to choose a image
 * it must be able to consume ImageSelectionContext, so it **must** be rendered inside
 * ImageSelectionProvider.
 */
export default function CreateOmbul() {
    const imageSelectionCtx = useContext(ImageSelectionContext)
    if (!imageSelectionCtx) throw new Error('CreateOmbul must be rendered inside ImageSelectionProvider')
    
    const handleCreate = createOmbul.bind(null, imageSelectionCtx.selectedImage.id)

    return (
        <div className={styles.CreateOmbul}>
            <Form
                action={handleCreate}
            >

            </Form>
            <div className={styles.chooseImage}>

            </div>
        </div>
        
    )
}
