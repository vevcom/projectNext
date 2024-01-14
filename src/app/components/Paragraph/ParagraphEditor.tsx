'use client'
import { EditModeContext } from '@/context/EditMode';
import styles from './ParagraphEditor.module.scss';
import { useContext } from 'react';
import type { Paragraph } from '@prisma/client';

type PropTypes = {
    paragraph: Paragraph
}

export default function ParagraphEditor({paragraph}: PropTypes) {
    const editmode = useContext(EditModeContext)
    if (!editmode) return null

    return (
        editmode.editMode ? (
            <div className={styles.ParagraphEditor}>
                EditParagraph
            </div>
        ) : (
            null
        )
        
    )
}
