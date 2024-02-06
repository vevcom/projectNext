'use client'
import { moveSectionOrder } from "@/actions/cms/articles/update"
import { EditModeContext } from "@/context/EditMode"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { useContext, useCallback } from "react"
import styles from './SectionMover.module.scss'
import { useRouter } from "next/navigation"

type PropTypes = {
    articleId: number
    sectionId: number
    className?: string
}

export default function SectionMover({ articleId, sectionId, className }: PropTypes) {
    const editMode = useContext(EditModeContext)
    const { refresh } = useRouter()
    const handleMove = useCallback(async (direction: 'UP' | 'DOWN') => {
        const res = (await moveSectionOrder(articleId, sectionId, direction))
        if (!res.success) {
            const m = res.error ? res?.error[0].message : 'dd'
            console.error(m)
        }        
        refresh()
    }, [sectionId, articleId, refresh])
    if (!editMode?.editMode) return null

    return (
        <div className={`${styles.SectionMover} ${className}`}>
            <button onClick={() => handleMove('UP')}>
                <FontAwesomeIcon icon={faArrowUp} />
            </button>
            <button onClick={() => handleMove('DOWN')}>
                <FontAwesomeIcon icon={faArrowDown} />
            </button>
        </div>
    )
}
