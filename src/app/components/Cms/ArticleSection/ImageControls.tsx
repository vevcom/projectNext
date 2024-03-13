'use client'
import styles from './ImageControls.module.scss'
import { updateArticleSectionAction } from '@/cms/articleSections/update'
import { EditModeContext } from '@/context/EditMode'
import { imageSizeIncrement, maxImageSize, minImageSize } from '@/cms/articleSections/ConfigVars'
import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronLeft,
    faChevronRight,
    faMaximize,
    faMinimize
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import type { ArticleSection } from '@prisma/client'

/**
 * This component is used to control the image in the article section
 * i.e move it left or right and size it
 */

type PropTypes = {
    articleSection: ArticleSection
    className?: string
}

export default function ImageControls({ articleSection, className }: PropTypes) {
    const editModeContext = useContext(EditModeContext)
    const { refresh } = useRouter()
    if (!editModeContext?.editMode) return null

    const moveLeft = async () => {
        await updateArticleSectionAction(articleSection.name, { imagePosition: 'LEFT' })
        refresh()
    }

    const moveRight = async () => {
        await updateArticleSectionAction(articleSection.name, { imagePosition: 'RIGHT' })
        refresh()
    }

    const increaseSize = async () => {
        await updateArticleSectionAction(articleSection.name, { imageSize: articleSection.imageSize + imageSizeIncrement })
        refresh()
    }

    const decreaseSize = async () => {
        await updateArticleSectionAction(articleSection.name, { imageSize: articleSection.imageSize - imageSizeIncrement })
        refresh()
    }

    return (
        <div className={`${className} ${styles.ImageControls}`}>
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
                    articleSection.imageSize + imageSizeIncrement > maxImageSize ?
                        `${styles.disabled}` : ''
                }>
                    <FontAwesomeIcon icon={faMaximize} />
                </button>
                <button onClick={decreaseSize} className={
                    articleSection.imageSize - imageSizeIncrement < minImageSize ?
                        `${styles.disabled}` : ''
                }>
                    <FontAwesomeIcon icon={faMinimize} />
                </button>
            </div>
        </div>
    )
}
