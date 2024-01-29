'use client'
import styles from './ImageControls.module.scss'
import { useContext } from 'react'
import update from '@/actions/cms/articleSections/update';
import { EditModeContext } from '@/context/EditMode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { Position } from '@prisma/client';

/**
 * This component is used to control the image in the article section
 * i.e move it left or right and size it
 */

type PropTypes = {
    currentSize: number,
    currentPosition: Position,
}

export default function ImageControls({ currentPosition, currentSize } : PropTypes) {
    const editModeContext = useContext(EditModeContext)
    if (!editModeContext) return null
    return (
        <div className={styles.ImageControls}>
            <FontAwesomeIcon className={styles.moveLeft} icon={faChevronLeft} />
        </div>
    )
}
