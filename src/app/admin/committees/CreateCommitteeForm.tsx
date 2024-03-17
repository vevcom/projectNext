'use client'
import styles from './CreateCommitteeForm.module.scss'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import { createCommitteeAction } from '@/actions/groups/committees/create'
import { ImageSelectionContext } from '@/context/ImageSelection'
import { useContext } from 'react'

/**
 * WARNING: The component expects to be rendered inside a ImageSelectionProvider, so the form can
 * be submitted with a committee logo.
 * A component to create a committee
 * @param defaultImage - The default image to use as a committee logo if no logo is selected
 * @returns committee form JSX
 */
export default function CreateCommitteeForm() {
    const imageSelection = useContext(ImageSelectionContext)
    if (!imageSelection) throw new Error('No context')

    const createCommittee = (data: FormData) => {
        if (imageSelection.selectedImage) {
            data.append('logoImageId', imageSelection.selectedImage.id.toString())
        }

        return createCommitteeAction(data)
    }

    return (
        <div className={styles.CreateCommitteeForm}>
            <Form action={createCommittee}>
                <TextInput name="name" label="Navn"/>
                <TextInput name="shortName" label="Kortnavn"/>
            </Form>
        </div>
    )
}
