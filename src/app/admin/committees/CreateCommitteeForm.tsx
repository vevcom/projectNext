'use client'
import styles from './CreateCommitteeForm.module.scss'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import create from '@/actions/groups/committees/create'
import { ImageSelectionContext } from '@/context/ImageSelection'
import { useContext } from 'react'
import type { Image } from '@prisma/client'

type PropTypes = {
    defaultImage: Image,
}

/**
 * WARNING: The component expects to be rendered inside a ImageSelectionProvider, so the form can
 * be submitted with a committee logo.
 * A component to create a committee
 * @param defaultImage - The default image to use as a committee logo if no logo is selected
 * @returns committee form JSX
 */
export default function CreateCommitteeForm({ defaultImage }: PropTypes) {
    const imageSelection = useContext(ImageSelectionContext)
    if (!imageSelection) throw new Error('No context')

    return (
        <div className={styles.CreateCommitteeForm}>
            <Form action={imageSelection.selectedImage ?
                create.bind(null, imageSelection.selectedImage.id) :
                create.bind(null, defaultImage?.id)
            }>
                <TextInput name="name" label="Navn"/>
            </Form>
        </div>
    )
}
