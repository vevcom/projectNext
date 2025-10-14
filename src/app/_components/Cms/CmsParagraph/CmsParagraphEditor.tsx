'use client'
import styles from './CmsParagraphEditor.module.scss'
import EditOverlay from '@/components/Cms/EditOverlay'
import Form from '@/components/Form/Form'
import PopUp from '@/components/PopUp/PopUp'
import useEditing from '@/hooks/useEditing'
import { configureAction } from '@/services/configureAction'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import 'easymde/dist/easymde.min.css'
import './CustomEditorClasses.scss'
import dynamic from 'next/dynamic'
import type { CmsParagraph } from '@prisma/client'
import type { UpdateCmsParagraphAction } from '@/cms/paragraphs/types'

//needed because SimpleMDE is not SSR compatible as it access navigator object
const DynamicSimpleMDEditor = dynamic(
    () => import('react-simplemde-editor'),
    {
        ssr: false,
        loading: () => <p className={styles.loader}>Loading...</p>
    }
)

type PropTypes = {
    cmsParagraph: CmsParagraph
    editorClassName?: string
    updateCmsParagraphAction: UpdateCmsParagraphAction
}

export default function CmsParagraphEditor({ cmsParagraph, editorClassName, updateCmsParagraphAction }: PropTypes) {
    const canEdit = useEditing({}) //TODO: pass visibility / permissions to useEditing
    const { refresh } = useRouter()
    const [content, setContent] = useState(cmsParagraph.contentMd)

    if (!canEdit) return null

    const handleContentChange = (value: string) => {
        setContent(value)
    }

    const action = configureAction(updateCmsParagraphAction, { params: { id: cmsParagraph.id } })

    return (
        <PopUp
            PopUpKey={cmsParagraph.id}
            showButtonClass={styles.openBtn}
            showButtonContent={
                <EditOverlay />
            }>
            <div className={`${styles.CmsParagraphEditor} ${editorClassName}`}>
                <DynamicSimpleMDEditor className={styles.editor} value={content} onChange={handleContentChange} />
                <Form
                    action={action.bind(null, { data: { markdown: content } })}
                    submitText="Oppdater"
                    successCallback={() => {
                        refresh()
                    }}
                />
            </div>
        </PopUp>
    )
}
