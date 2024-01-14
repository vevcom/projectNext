'use client'
import { EditModeContext } from '@/context/EditMode';
import styles from './EditParagraph.module.scss';
import { useContext } from 'react';

export default function EditParagraph() {
    const editmode = useContext(EditModeContext)
    if (!editmode) return null

    return (
        <div>
            EditParagraph
        </div>
    )
}
