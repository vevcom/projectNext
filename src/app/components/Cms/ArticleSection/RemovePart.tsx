'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import styles from './RemovePart.module.scss'
import { EditModeContext } from '@/context/EditMode';
import { useContext } from 'react';
import { Part } from '@/actions/cms/articleSections/update';
import { removePart } from '@/actions/cms/articleSections/update';

type PropTypes = {
    part: Part,
    articleSectionName: string
}

export default function RemovePart({ part, articleSectionName }: PropTypes) {
    const editContext = useContext(EditModeContext)
    if (!editContext?.editMode) return null

    return (
        <button className={styles.RemovePart} onClick={removePart.bind(null, articleSectionName).bind(null, part)}>
            <FontAwesomeIcon icon={faX} />
        </button>
    );
}