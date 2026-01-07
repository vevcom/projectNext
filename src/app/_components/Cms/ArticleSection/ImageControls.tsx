'use client'
import styles from './ImageControls.module.scss'
import useEditMode from '@/hooks/useEditMode'
import { imageSizeIncrement, maxImageSize, minImageSize } from '@/cms/articleSections/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronLeft,
    faChevronRight,
    faMaximize,
    faMinimize
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import type { ArticleSection } from '@prisma/client'
import type { UpdateArticleSectionAction } from '@/cms/articleSections/types'
import type { AuthResultTypeAny } from '@/auth/authorizer/AuthResult'

type PropTypes = {
    articleSection: ArticleSection
    className?: string
    updateArticleSectionAction: UpdateArticleSectionAction
    canEdit: AuthResultTypeAny
}

/**
 * This component is used to control the image in the article section
 * i.e move it left or right and size it
 */
export default function ImageControls({ articleSection, className, updateArticleSectionAction, canEdit }: PropTypes) {
    const editable = useEditMode({ authResult: canEdit })
    const { refresh } = useRouter()

    const moveLeft = async () => {
        await updateArticleSectionAction(
            { params: { articleSectionName: articleSection.name } },
            { data: { position: 'LEFT' } }
        )
        refresh()
    }

    const moveRight = async () => {
        await updateArticleSectionAction(
            { params: { articleSectionName: articleSection.name } },
            { data: { position: 'RIGHT' } }
        )
        refresh()
    }

    const increaseSize = async () => {
        await updateArticleSectionAction(
            { params: { articleSectionName: articleSection.name } },
            { data: { imageSize: articleSection.imageSize + imageSizeIncrement } }
        )
        refresh()
    }

    const decreaseSize = async () => {
        await updateArticleSectionAction(
            { params: { articleSectionName: articleSection.name } },
            { data: { imageSize: articleSection.imageSize - imageSizeIncrement } }
        )
        refresh()
    }

    if (!editable) return null
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
