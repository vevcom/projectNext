'use client'

import { createOmbul } from '@/actions/ombul/create'
import Form from '@/components/Form/Form'
import styles from './CreateOmbul.module.scss'
import TextInput from '../components/UI/TextInput'
import NumberInput from '../components/UI/NumberInput'
import FileInput from '../components/UI/FileInput'
import { useState } from 'react'
import { Ombul } from '@prisma/client'
import { useRouter } from 'next/navigation'
import Textarea from '../components/UI/Textarea'

type PropTypes = {
    latestOmbul: Ombul | null
}

/**
 * This component is for creating ombul issues. Since it needs to be able to choose a image
 * it must be able to consume ImageSelectionContext, so it **must** be rendered inside
 * ImageSelectionProvider.
 * @param latestOmbul - The latest ombul issue, used to set default values for year and issueNumber of next ombul
 */
export default function CreateOmbul({ latestOmbul }: PropTypes) {
    const { refresh } = useRouter()
    const currentYear = new Date().getFullYear()

    let nextYear : number;
    let nextIssue : number;
    if (!latestOmbul) {
        nextYear = currentYear;
        nextIssue = 1;
    } else if (currentYear === latestOmbul?.year) {
        nextYear = currentYear;
        nextIssue = latestOmbul.issueNumber + 1;
    } else {
        nextYear = currentYear;
        nextIssue = 1;
    }
    const [image, setImage] = useState<File | null>(null);

    const handleImgPreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        console.log(files);
        if (files) {
            console.log(files[0]);
            setImage(files[0]);
        }
    }

    return (
        <div className={styles.CreateOmbul}>
            <Form
                action={createOmbul}
                submitText="Lag ombul"
                className={styles.form}
                successCallback={refresh}
            >
                <TextInput label="navn" name="name" />
                <Textarea label="beskrivelse" name="description" />
                <NumberInput label="År" name="year" defaultValue={nextYear} />
                <NumberInput label="nummer" name="issueNumber" defaultValue={nextIssue} />
                <FileInput color="primary" label="Ombul fil" name="ombulFile" />
                <FileInput color="primary" label="Ombul cover" name="ombulCoverImage" onChange={handleImgPreview} />
            </Form>
            <div className={styles.imgPreview}>
                {
                    image && (
                        <img src={URL.createObjectURL(image)} alt={image.name} />
                    )
                }
            </div>
        </div>
        
    )
}
