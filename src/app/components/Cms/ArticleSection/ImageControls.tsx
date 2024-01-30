'use client'
import styles from './ImageControls.module.scss'
import { useContext } from 'react'
import update from '@/actions/cms/articleSections/update';
import { EditModeContext } from '@/context/EditMode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChevronLeft, 
    faChevronRight,
    faMaximize,
    faMinimize
} from '@fortawesome/free-solid-svg-icons';
import type { ArticleSection } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { increment, maxImageSize, minImageSize } from '@/actions/cms/articleSections/ConfigVars';

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

    const moveRight = async () => {
        await update(articleSection.name, { imagePosition: 'RIGHT' })
        refresh()
    }

    const increaseSize = async () => {
        await update(articleSection.name, { imageSize: articleSection.imageSize + increment })
        refresh()
    }

    const decreaseSize = async () => {
        await update(articleSection.name, { imageSize: articleSection.imageSize - increment })
        refresh()
    }

    return (
        <div className={styles.ImageControls}>
            {
                articleSection.imagePosition === 'LEFT' ? (
                    <button onClick={moveRight} className={styles.moveRight}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                ) : (
                    <button onClick={moveLeft} className={styles.moveLeft}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                )
            }
            <div 
                className={
                    articleSection.imagePosition === 'LEFT' ? 
                        `${styles.adjustSize} ${styles.placeLeft}` : 
                        `${styles.adjustSize} ${styles.placeRight}`
                }
            >
                <button onClick={increaseSize} className={
                    articleSection.imageSize + increment > maxImageSize ? 
                        `${styles.disabled}` : ''
                }>
                    <FontAwesomeIcon icon={faMaximize} />
                </button>
                <button onClick={decreaseSize} className={
                    articleSection.imageSize - increment < minImageSize ? 
                    `${styles.disabled}` : ''
                }>
                    <FontAwesomeIcon icon={faMinimize} />
                </button>
            </div>
        </div>
    )
}
