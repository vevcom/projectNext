'use client'

import { EditModeContext } from "@/context/EditMode"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { useContext } from "react"
import styles from './SectionMover.module.scss'

export default function SectionMover() {
    const editMode = useContext(EditModeContext)
    if (!editMode?.editMode) return null

    return (
        <div className={styles.SectionMover}>
            <button>
                <FontAwesomeIcon icon={faArrowUp} />
            </button>
            <button>
                <FontAwesomeIcon icon={faArrowDown} />
            </button>
        </div>
    )
}
