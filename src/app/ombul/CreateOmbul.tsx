'use client'

import { createOmbul } from '@/actions/ombul/create'
import Form from '@/components/Form/Form'
import styles from './CreateOmbul.module.scss'

export default function CreateOmbul() {
    const selection = 1
    const handleCreate = createOmbul.bind(null, selection)

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
