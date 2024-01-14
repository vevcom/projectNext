'use client'
import { EditModeContext } from '@/context/EditMode';
import styles from './ParagraphEditor.module.scss';
import { useContext, useState } from 'react';
import type { Paragraph } from '@prisma/client';
import { ChangeEvent } from 'react';
import Form from '@/components/Form/Form';
import update from '@/actions/paragraphs/update';

type PropTypes = {
    paragraph: Paragraph
}

export default function ParagraphEditor({paragraph}: PropTypes) {
    const editmode = useContext(EditModeContext)
    if (!editmode) return null
    const [content, setContent] = useState(paragraph.content)

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
                >

                </Form>
            </div>
        )
    )
}
