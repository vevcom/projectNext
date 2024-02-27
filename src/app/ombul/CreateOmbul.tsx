'use client'

import { createOmbul } from '@/actions/ombul/create'
import Form from '@/components/Form/Form'
import styles from './CreateOmbul.module.scss'

/**
 * This component is for creating ombul issues. Since it needs to be able to choose a image
 * it must be able to consume ImageSelectionContext, so it **must** be rendered inside
 * ImageSelectionProvider.
 */
export default function CreateOmbul() {
    

    return (
        <div className={styles.CreateOmbul}>
            <Form
                action={createOmbul}
            >

            </Form>
            <div className={styles.chooseImage}>

            </div>
        </div>
        
    )
}
