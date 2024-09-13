'use client'
import styles from './CollectionAdminUpload.module.scss'
import Dropzone from '@/components/UI/Dropzone'
import PopUp from '@/components/PopUp/PopUp'
import { createImagesAction } from '@/actions/images/create'
import { maxNumberOfImagesInOneBatch } from '@/services/images/ConfigVars'
import Form from '@/components/Form/Form'
import Checkbox from '@/app/_components/UI/Checkbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import type { FileWithStatus } from '@/components/UI/Dropzone'
import type { ActionReturn } from '@/actions/Types'

type PropTypes = {
    collectionId: number
    refreshImages: () => void
}

export default function CollectionAdminUpload({ collectionId, refreshImages }: PropTypes) {
    const [files, setFiles] = useState<FileWithStatus[]>([])

    const handleBatchedUpload = async (data: FormData) => {
        // split files into batches of maxNumberOfImagesInOneBatch
        const batches = files.reduce((acc, file, index) => {
            if (index % maxNumberOfImagesInOneBatch === 0) {
                acc.push([])
            }
            acc[acc.length - 1].push(file)
            return acc
        }, [] as FileWithStatus[][])

        const useFileName = data.get('useFileName') === 'on'

        let res: ActionReturn<void> = { success: true, data: undefined }
        for (const batch of batches) {
            const formData = new FormData()
            batch.forEach(file => {
                formData.append('files', file.file)
            })
            setFiles(prev => prev.map(file => {
                if (batch.includes(file)) {
                    return { ...file, uploadStatus: 'uploading' }
                }
                return file
            }))
            res = await createImagesAction.bind(null, useFileName).bind(null, collectionId)(formData)
            if (res.success) {
                setFiles(prev => prev.map(file => {
                    if (batch.includes(file)) {
                        return { ...file, uploadStatus: 'done' }
                    }
                    return file
                }))
                setTimeout(() => {
                    setFiles(prev => prev.filter(file => !batch.includes(file)))
                }, 2000)
            } else {
                setFiles(prev => prev.map(file => {
                    if (batch.includes(file)) {
                        return { ...file, uploadStatus: 'error' }
                    }
                    return file
                }))
                return res
            }
        }
        setFiles([])
        return res
    }

    return (
        <PopUp PopUpKey="UploadImages" showButtonContent={
            <>
            Last opp mange
                <FontAwesomeIcon icon={faUpload} />
            </>
        }>
            <Form
                className={styles.uploadMany}
                successCallback={refreshImages}
                closePopUpOnSuccess="UploadImages"
                title="last opp bilder"
                submitText="last opp"
                action={handleBatchedUpload}
            >
                <Dropzone label="last opp" name="files" files={files} setFiles={setFiles}/>
                <Checkbox label="Bruk filnavn som navn" name="useFileName" />
            </Form>
        </PopUp>
    )
}
