'use client'
import styles from './SectionMover.module.scss'
import useEditMode from '@/hooks/useEditmode'
import { RequireNothing } from '@/auth/authorizer/RequireNothing'
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
    //TODO: Authorizer must be passed in....
    const canEdit = useEditMode({
        authorizer: RequireNothing.staticFields({}).dynamicFields({})
    })
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
