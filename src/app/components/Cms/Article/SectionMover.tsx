'use client'
import styles from './SectionMover.module.scss'
import { moveSectionOrder } from '@/actions/cms/articles/update'
import { EditModeContext } from '@/context/EditMode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useContext, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type PropTypes = {
    articleId: number
    sectionId: number
    className?: string
    showUp: boolean
    showDown: boolean
}

export default function SectionMover({ articleId, sectionId, className, showUp, showDown }: PropTypes) {
    const editMode = useContext(EditModeContext)
    const { refresh } = useRouter()
    const handleMove = useCallback(async (direction: 'UP' | 'DOWN') => {
        const res = (await moveSectionOrder(articleId, sectionId, direction))
        if (!res.success) {
            const m = res.error ? res?.error[0].message : 'dd'
        }
        refresh()
    }, [sectionId, articleId, refresh])
    if (!editMode?.editMode) return null

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
