'use client'
import { EditModeContext } from '@/context/EditMode';
import styles from './ParagraphEditor.module.scss';
import { useContext } from 'react';

export default function ParagraphEditor() {
    const editmode = useContext(EditModeContext)
    if (!editmode) return null

    return (
        <div>
            EditParagraph
        </div>
    )
}
