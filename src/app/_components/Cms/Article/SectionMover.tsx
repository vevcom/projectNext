'use client'
import styles from './SectionMover.module.scss'
import useEditing from '@/hooks/useEditing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ConfiguredAction } from '@/services/actionTypes'
import type { ReorderArticleSectionsAction } from '@/cms/articles/types'

type PropTypes = {
    className?: string
    showUp: boolean
    showDown: boolean
    reorderArticleSectionsAction: ConfiguredAction<ReorderArticleSectionsAction>
}

export default function SectionMover({
    className,
    showUp,
    showDown,
    reorderArticleSectionsAction
}: PropTypes) {
    const canEdit = useEditing({}) //TODO: check visibility of section for user and pass it to useEditing
    const { refresh } = useRouter()
    const handleMove = useCallback(async (direction: 'UP' | 'DOWN') => {
        await reorderArticleSectionsAction({ data: { direction } })
        refresh()
    }, [reorderArticleSectionsAction, refresh])
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
