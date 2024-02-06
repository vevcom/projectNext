'use client'
import { moveSectionOrder } from "@/actions/cms/articles/update"
import { EditModeContext } from "@/context/EditMode"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { useContext, useCallback } from "react"
import styles from './SectionMover.module.scss'
import { useRouter } from "next/navigation"

type PropTypes = {
    sectionId: number
    className?: string
}

export default function SectionMover({ sectionId, className }: PropTypes) {
    const editMode = useContext(EditModeContext)
    const { refresh } = useRouter()
    if (!editMode?.editMode) return null

    const handleMove = useCallback(async (direction: 'UP' | 'DOWN') => {
        console.log(await moveSectionOrder(sectionId, direction))
        refresh()
    }, [sectionId])

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
