'use client'
import styles from './AddNews.module.scss'
import Textarea from '@/components/UI/Textarea'
import { createNewsAction } from '@/services/news/actions'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { EditModeContext } from '@/contexts/EditMode'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import type { ExpandedNewsArticle } from '@/services/news/Types'

export default function AddNews() {
    const { push } = useRouter()
    const editModeCtx = useContext(EditModeContext)
    const handleCreate = (data?: ExpandedNewsArticle) => {
        editModeCtx?.setEditMode(true)
        push(`/news/${data?.orderPublished}/${data?.articleName}`)
    }

    return (
        <div className={styles.AddNews}>
            <Form
                action={createNewsAction}
                successCallback={handleCreate}
                submitText="Lag nyhet"
            >
                <TextInput label="navn" name="name" />
                <Textarea label="beskrivelse" name="description" />
            </Form>
        </div>
    )
}
