'use client'
import styles from './ParagraphEditor.module.scss'
import { EditModeContext } from '@/context/EditMode'
import Form from '@/components/Form/Form'
import update from '@/actions/paragraphs/update'
import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import 'easymde/dist/easymde.min.css'
import './CustomEditorClasses.scss'
import dynamic from 'next/dynamic'
import type { Paragraph } from '@prisma/client'

const DynamicSimpleMDEditor = dynamic(
    () => import('react-simplemde-editor'),
    {
        ssr: false,
        loading: () => <p className={styles.loader}>Loading...</p>
    }
)


type PropTypes = {
    paragraph: Paragraph
}

const ParagraphEditor = ({ paragraph }: PropTypes) => {
    const editmode = useContext(EditModeContext)
    const { refresh } = useRouter()
    const [content, setContent] = useState(paragraph.contentMd)

    if (!editmode) return null

    const handleContentChange = (value: string) => {
        setContent(value)
    }

    return (
        editmode.editMode && (
            <div className={styles.ParagraphEditor}>
                <DynamicSimpleMDEditor className={styles.editor} value={content} onChange={handleContentChange} />
                <Form
                    action={update.bind(null, paragraph.id).bind(null, content)}
                    submitText="Update"
                    successCallback={refresh}
                />
            </div>
        )
    )
}

export default ParagraphEditor
