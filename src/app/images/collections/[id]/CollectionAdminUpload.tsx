'use client'
import Dropzone from '@/components/UI/Dropzone'
import PopUp from '@/components/PopUp/PopUp'
import styles from './CollectionAdminUpload.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { createImagesAction } from '@/actions/images/create'
import { maxNumberOfImagesInOneBatch } from '@/services/images/ConfigVars'
import Form from '@/components/Form/Form'
import type { FileWithStatus } from '@/components/UI/Dropzone'
import type { ActionReturn } from '@/actions/Types'

type PropTypes = {
    collectionId: number
    refreshImages: () => void
}

export default function CollectionAdminUpload({ collectionId, refreshImages }: PropTypes) {
    const [files, setFiles] = useState<FileWithStatus[]>([])

    const handleBatchedUpload = async () => {
        // split files into batches of maxNumberOfImagesInOneBatch
        const batches = files.reduce((acc, file, index) => {
            if (index % maxNumberOfImagesInOneBatch === 0) {
                acc.push([])
            }
            acc[acc.length - 1].push(file)
            return acc
        }, [] as FileWithStatus[][])

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
            res = await createImagesAction.bind(null, collectionId)(formData)
            if (res.success) {
                setFiles(prev => prev.map(file => {
                    if (batch.includes(file)) {
                        return { ...file, uploadStatus: 'done' }
                    }
                    return file
                }))
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
            </Form>
        </PopUp>
    )
}
