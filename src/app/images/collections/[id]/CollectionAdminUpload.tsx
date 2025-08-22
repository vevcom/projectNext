'use client'
import styles from './CollectionAdminUpload.module.scss'
import Dropzone from '@/components/UI/Dropzone'
import Form from '@/components/Form/Form'
import Slider from '@/components/UI/Slider'
import ProgressBar from '@/components/ProgressBar/ProgressBar'
import TextInput from '@/app/_components/UI/TextInput'
import LicenseChooser from '@/app/_components/LicenseChooser/LicenseChooser'
import { ImageConfig } from '@/services/images/config'
import { useCallback, useState } from 'react'
import type { FileWithStatus } from '@/components/UI/Dropzone'
import type { ActionReturn } from '@/services/actionTypes'
import { createImagesAction } from '@/actions/images/create'

type PropTypes = {
    collectionId: number
    refreshImages: () => void
}

export default function CollectionAdminUpload({ collectionId, refreshImages }: PropTypes) {
    const [files, setFiles] = useState<FileWithStatus[]>([])
    const [progress, setProgress] = useState<number | null>(null)

    const handleBatchedUpload = useCallback(async (data: FormData) => {
        // split files into batches of maxNumberOfImagesInOneBatch
        const batches = files.reduce((acc, file, index) => {
            if (index % ImageConfig.maxNumberInOneBatch === 0) {
                acc.push([])
            }
            acc[acc.length - 1].push(file)
            return acc
        }, [] as FileWithStatus[][])
        const doneFiles: FileWithStatus[] = []

        const useFileName = data.get('useFileName') === 'on'
        const credit = typeof data.get('credit') === 'string' ? data.get('credit') : undefined
        const licenseId = typeof data.get('licenseId') === 'string' ? data.get('licenseId') : undefined

        let res: ActionReturn<void> = { success: true, data: undefined }
        setProgress(0)
        const progressIncrement = 1 / batches.length
        for (const batch of batches) {
            const formData = new FormData()
            if (credit) formData.append('credit', credit)
            if (licenseId) formData.append('licenseId', licenseId)
            batch.forEach(file => {
                formData.append('files', file.file)
            })
            setFiles(prev => prev.map(file => {
                if (batch.includes(file)) {
                    return { ...file, uploadStatus: 'uploading' }
                }
                return file
            }))
            res = await createImagesAction({ useFileName, collectionId }, formData)
            if (res.success) {
                doneFiles.push(...batch)
                setFiles(files.map(file => {
                    if (doneFiles.includes(file)) {
                        return { ...file, uploadStatus: 'done' }
                    }
                    return file
                }))
                setProgress(prev => (prev ?? 0) + progressIncrement)
            } else {
                setProgress(null)
                setFiles(files.map(file => {
                    if (batch.includes(file)) {
                        return { ...file, uploadStatus: 'error' }
                    }
                    return file
                }))
                return res
            }
        }
        setProgress(null)
        setFiles([])
        return res
    }, [files, progress, collectionId])

    return (
        <Form
            className={styles.uploadMany}
            successCallback={refreshImages}
            closePopUpOnSuccess="UploadImages"
            title="last opp bilder"
            submitText="last opp"
            action={handleBatchedUpload}
        >
            <Dropzone label="last opp" name="files" files={files} setFiles={setFiles}/>
            <TextInput name="credit" label="Kreditering" />
            <LicenseChooser />
            <Slider label="Bruk filnavn som navn" name="useFileName" />
            {
                progress ? <ProgressBar progress={progress} /> : <></>
            }
        </Form>
    )
}
