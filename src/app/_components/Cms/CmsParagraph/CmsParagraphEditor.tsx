'use client'
import 'easymde/dist/easymde.min.css'
import './CustomEditorClasses.scss'
import styles from './CmsParagraphEditor.module.scss'
import EditOverlay from '@/components/Cms/EditOverlay'
import Form from '@/components/Form/Form'
import PopUp from '@/components/PopUp/PopUp'
import { configureAction } from '@/services/configureAction'
import useEditMode from '@/hooks/useEditMode'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { CmsParagraph } from '@prisma/client'
import type { UpdateCmsParagraphAction } from '@/cms/paragraphs/types'
import type { AuthResultTypeAny } from '@/auth/auther/AuthResult'

// Needed because SimpleMDE is not SSR compatible as it access navigator object
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
    canEdit: AuthResultTypeAny
}

export default function CmsParagraphEditor({ cmsParagraph, editorClassName, updateCmsParagraphAction, canEdit }: PropTypes) {
    const editable = useEditMode({ authResult: canEdit })
    const { refresh } = useRouter()
    const [content, setContent] = useState(cmsParagraph.contentMd)

    const handleContentChange = (value: string) => {
        setContent(value)
    }

    const action = configureAction(updateCmsParagraphAction, { params: { paragraphId: cmsParagraph.id } })

    if (!editable) return null
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
