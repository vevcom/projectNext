'use client'

import { createOmbul } from '@/actions/ombul/create'
import Form from '@/components/Form/Form'
import styles from './CreateOmbul.module.scss'
import TextInput from '../components/UI/TextInput'
import NumberInput from '../components/UI/NumberInput'
import FileInput from '../components/UI/FileInput'

/**
 * This component is for creating ombul issues. Since it needs to be able to choose a image
 * it must be able to consume ImageSelectionContext, so it **must** be rendered inside
 * ImageSelectionProvider.
 */
export default function CreateOmbul() {
    const currentYear = new Date().getFullYear()

    return (
        <div className={styles.CreateOmbul}>
            <Form
                action={createOmbul}
                submitText="Lag ombul"
                className={styles.form}
            >
                <TextInput label="navn" name="name" />
                <NumberInput label="År" name="year" defaultValue={currentYear} />
                <NumberInput label="nummer" name="issueNumber" />
                <FileInput color="primary" label="Ombul fil" name="ombulFile" />
                <FileInput color="primary" label="Ombul cover" name="ombulCoverImage" />
            </Form>
            <div className={styles.chooseImage}>

            </div>
        </div>
        
    )
}
