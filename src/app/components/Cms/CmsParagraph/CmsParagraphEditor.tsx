'use client'
import styles from './CmsParagraphEditor.module.scss'
import { EditModeContext } from '@/context/EditMode'
import Form from '@/components/Form/Form'
import update from '@/actions/cms/paragraphs/update'
import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import 'easymde/dist/easymde.min.css'
import './CustomEditorClasses.scss'
import dynamic from 'next/dynamic'
import type { CmsParagraph } from '@prisma/client'
import EditOverlay from '../EditOverlay'
import PopUp from '@/components/PopUp/PopUp'

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
}

export default function CmsParagraphEditor({ cmsParagraph, editorClassName }: PropTypes) {
    const editmode = useContext(EditModeContext)
    const { refresh } = useRouter()
    const [content, setContent] = useState(cmsParagraph.contentMd)

    if (!editmode?.editMode) return null

    const handleContentChange = (value: string) => {
        setContent(value)
    }

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
                    action={update.bind(null, cmsParagraph.id).bind(null, content)}
                    submitText="Update"
                    successCallback={() => {
                        refresh()
                    }}
                />
            </div>
        </PopUp>
    )
}
