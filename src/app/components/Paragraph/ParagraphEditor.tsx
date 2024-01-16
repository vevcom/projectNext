'use client'
import { EditModeContext } from '@/context/EditMode';
import styles from './ParagraphEditor.module.scss';
import { useContext, useState } from 'react';
import type { Paragraph } from '@prisma/client';
import Form from '@/components/Form/Form';
import update from '@/actions/paragraphs/update';
import { useRouter } from 'next/navigation';
import SimpleMDEEditor from 'react-simplemde-editor';
import './CustomEditorClasses.scss'
import 'easymde/dist/easymde.min.css';

type PropTypes = {
    paragraph: Paragraph
}

const ParagraphEditor = ({ paragraph }: PropTypes) => {
    const editmode = useContext(EditModeContext);
    const { refresh } = useRouter();
    const [content, setContent] = useState(paragraph.contentMd);

    if (!editmode) return null;

    const handleContentChange = (value: string) => {
        setContent(value);
    };

    return (
        editmode.editMode && (
            <div className={styles.ParagraphEditor}>
                <SimpleMDEEditor value={content} onChange={handleContentChange} />
                <Form
                    action={update.bind(null, paragraph.id).bind(null, content)}
                    submitText='Update'
                    successCallback={refresh}
                />
            </div>
        )
    );
};

export default ParagraphEditor;