'use client'

import styles from './GroupSelector.module.scss'
import { GroupSelectionContext } from '@/context/groupSelection'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useContext } from 'react'
import type { ExpandedGroup } from '@/server/groups/Types'

type PropTypes = {
    group: ExpandedGroup
}

export default function GroupSelector({ group }: PropTypes) {
    const groupSelectionCtx = useContext(GroupSelectionContext)
    const handleAdd = useCallback(() => {
        groupSelectionCtx?.setGroup(group)
    }, [group, groupSelectionCtx?.setGroup])
    if (!groupSelectionCtx) return null

    return (
        <button onClick={handleAdd} className={groupSelectionCtx.group && groupSelectionCtx.group.id === group.id ?
            `${styles.GroupSelector} ${styles.checked}` :
            `${styles.GroupSelector}`
        }>
            <FontAwesomeIcon icon={faArrowRight} />
        </button>
    )
}
