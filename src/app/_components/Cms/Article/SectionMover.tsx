'use client'
import styles from './SectionMover.module.scss'
import { moveSectionOrderAction } from '@/actions/cms/articles/update'
import useEditing from '@/hooks/useEditing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

type PropTypes = {
    articleId: number
    sectionId: number
    className?: string
    showUp: boolean
    showDown: boolean
}

export default function SectionMover({ articleId, sectionId, className, showUp, showDown }: PropTypes) {
    const canEdit = useEditing({}) //TODO: check visibility of section for user and pass it to useEditing
    const { refresh } = useRouter()
    const handleMove = useCallback(async (direction: 'UP' | 'DOWN') => {
        await moveSectionOrderAction(articleId, sectionId, direction)
        refresh()
    }, [sectionId, articleId, refresh])
    if (!canEdit) return null

    return (
        <div className={`${styles.SectionMover} ${className}`}>
            {
                showUp && <button onClick={() => handleMove('UP')}>
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
            }
            {
                showDown && <button onClick={() => handleMove('DOWN')}>
                    <FontAwesomeIcon icon={faArrowDown} />
                </button>
            }
        </div>
    )
}
