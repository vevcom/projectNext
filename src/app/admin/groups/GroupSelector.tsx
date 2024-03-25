'use client'

import { GroupSelectionContext } from '@/context/groupSelection'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useContext } from 'react'
import styles from './GroupSelector.module.scss'

type PropTypes = {
    groupId: number
}

export default function GroupSelector({ groupId }: PropTypes) {
    const groupSelectionCtx = useContext(GroupSelectionContext)
    if (!groupSelectionCtx) return null

    const handleAdd = useCallback(() => {
        groupSelectionCtx.setGroup(groupId)
    }, [groupId, groupSelectionCtx.setGroup])

    return (
        <button onClick={handleAdd} className={groupSelectionCtx.group === groupId ? 
            `${styles.GroupSelector} ${styles.checked}` :
            `${styles.GroupSelector}` 
        }>
            <FontAwesomeIcon icon={faArrowRight} />
        </button>
    )
}
