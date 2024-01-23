'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import styles from './RemovePart.module.scss'
import { EditModeContext } from '@/context/EditMode';
import { useCallback, useContext } from 'react';
import { Part } from '@/actions/cms/articleSections/update';
import { removePart } from '@/actions/cms/articleSections/update';
import { useRouter } from 'next/navigation';

type PropTypes = {
    part: Part,
    articleSectionName: string
}

export default function RemovePart({ part, articleSectionName }: PropTypes) {
    const { refresh } = useRouter()
    const editContext = useContext(EditModeContext)
    if (!editContext?.editMode) return null
    const handleRemove = useCallback(async () => {
        await removePart(articleSectionName, part)
        refresh()
    }, [articleSectionName, part])

    return (
        <button className={styles.RemovePart} onClick={handleRemove}>
            <FontAwesomeIcon icon={faX} />
        </button>
    );
}