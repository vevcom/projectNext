'use client'
import styles from './SectionMover.module.scss'
import useEditMode from '@/hooks/useEditMode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ConfiguredAction } from '@/services/actionTypes'
import type { ReorderArticleSectionsAction } from '@/cms/articles/types'
import type { AuthResultTypeAny } from '@/auth/authorizer/AuthResult'

type PropTypes = {
    className?: string
    showUp: boolean
    showDown: boolean
    reorderArticleSectionsAction: ConfiguredAction<ReorderArticleSectionsAction>
    canEdit: AuthResultTypeAny
}

export default function SectionMover({
    className,
    showUp,
    showDown,
    reorderArticleSectionsAction,
    canEdit,
}: PropTypes) {
    const editable = useEditMode({ authResult: canEdit })
    const { refresh } = useRouter()

    const handleMove = useCallback(async (direction: 'UP' | 'DOWN') => {
        await reorderArticleSectionsAction({ data: { direction } })
        refresh()
    }, [reorderArticleSectionsAction, refresh])

    if (!editable) return null
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
