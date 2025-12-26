'use client'
import 'easymde/dist/easymde.min.css'
import './CustomEditorClasses.scss'
import styles from './CmsParagraphEditor.module.scss'
import EditOverlay from '@/components/Cms/EditOverlay'
import Form from '@/components/Form/Form'
import PopUp from '@/components/PopUp/PopUp'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import { configureAction } from '@/services/configureAction'
import useEditMode from '@/hooks/useEditMode'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    //TODO: Auther must be passed in....
    const canEdit = useEditMode({
        auther: RequireNothing.staticFields({}).dynamicFields({})
    })
    const { refresh } = useRouter()
    const [content, setContent] = useState(cmsParagraph.contentMd)

    if (!canEdit) return null

    const handleContentChange = (value: string) => {
        setContent(value)
    }

    const action = configureAction(updateCmsParagraphAction, { params: { paragraphId: cmsParagraph.id } })

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
