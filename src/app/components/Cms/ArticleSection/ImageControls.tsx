'use client'
import styles from './ImageControls.module.scss'
import { useContext } from 'react'
import update from '@/actions/cms/articleSections/update';
import { EditModeContext } from '@/context/EditMode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { ArticleSection, Position } from '@prisma/client';
import { useRouter } from 'next/navigation';

/**
 * This component is used to control the image in the article section
 * i.e move it left or right and size it
 */

type PropTypes = {
    articleSection: ArticleSection
}

export default function ImageControls({ articleSection } : PropTypes) {
    const editModeContext = useContext(EditModeContext)
    const { refresh } = useRouter()
    if (!editModeContext?.editMode) return null

    const moveLeft = async () => {
        await update(articleSection.name, { imagePosition: 'LEFT' })
        refresh()
    }

    return (
        <div className={styles.ImageControls}>
            <button onClick={moveLeft} className={styles.moveLeft}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button>

            </button>
        </div>
    )
}
