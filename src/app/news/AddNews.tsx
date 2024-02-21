'use client'
import styles from './AddNews.module.scss'
import Textarea from '@/components/UI/Textarea'
import { createNews } from '@/actions/news/create'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { EditModeContext } from '@/context/EditMode'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import type { ExpandedNewsArticle } from '@/actions/news/Types'

export default function AddNews() {
    const { push } = useRouter()
    const editModeCtx = useContext(EditModeContext)
    const handleCreate = (data?: ExpandedNewsArticle) => {
        editModeCtx?.setEditMode(true)
        push(`/news/${data?.articleName}`)
    }

    return (
        <div className={styles.AddNews}>
            <Form
                action={createNews}
                successCallback={handleCreate}
                submitText="Lag nyhet"
            >
                <TextInput label="navn" name="name" />
                <Textarea label="beskrivelse" name="description" />
            </Form>
        </div>
    )
}
