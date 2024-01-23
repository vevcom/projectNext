'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import styles from './RemovePart.module.scss'
import { EditModeContext } from '@/context/EditMode';
import { useContext } from 'react';

type PropTypes = {
    removePart: () => void
}

export default function RemovePart({ removePart }: PropTypes) {
    const editContext = useContext(EditModeContext)
    if (!editContext?.editMode) return null

    return (
        <button className={styles.RemovePart} onClick={removePart}>
            <FontAwesomeIcon icon={faX} />
        </button>
    );
}