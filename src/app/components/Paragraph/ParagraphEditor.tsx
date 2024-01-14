'use client'
import { EditModeContext } from '@/context/EditMode';
import styles from './ParagraphEditor.module.scss';
import { useContext, useState } from 'react';
import type { Paragraph } from '@prisma/client';
import { ChangeEvent } from 'react';
import Form from '@/components/Form/Form';
import update from '@/actions/paragraphs/update';
import { useRouter } from 'next/navigation';

type PropTypes = {
    paragraph: Paragraph
}

export default function ParagraphEditor({ paragraph }: PropTypes) {
    const editmode = useContext(EditModeContext)
    const { refresh } = useRouter()
    const [content, setContent] = useState(paragraph.content)
    if (!editmode) return null

    const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        setContent(e.target.value)
    }

    return (
        editmode.editMode && (
            <div className={styles.ParagraphEditor}>
                <textarea onChange={handleContentChange}>
                    {content}
                </textarea>
                <Form
                    action={update.bind(null, paragraph.id).bind(null, content)}
                    submitText='Update'
                    successCallback={refresh}
                />
            </div>
        )
    )
}
