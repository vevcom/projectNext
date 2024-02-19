'use client'
import { EditModeContext } from "@/context/EditMode"
import { useContext } from "react"
import styles from './EditNews.module.scss'
import Form from '@/components/Form/Form'

export default function EditNews() {
    const editModeCtx = useContext(EditModeContext)
    //TODO: chack visibility
    const canEdit = true //temp
    if (!editModeCtx?.editMode) return null

    //TODO: add publish functionality with visibility
    const isPublished = false //temp

    return (
        <div className={styles.EditNews}>
            
            {
                isPublished ? (
                    <Form
                        action={publishNews}
                        successCallback={handleUpdate}
                        submitText="Publish"
                    />
                )
            }
        </div>
    )
}
