'use client'
import styles from './Reprioritize.module.scss'
import { updateApplicationAction } from '@/actions/applications/update'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

type PropTypes = {
    showUp?: boolean,
    showDown?: boolean
    userId: number
    commiteeParticipationId: number
}

export default function Reprioritize({ showUp, showDown, userId, commiteeParticipationId }: PropTypes) {
    const { refresh } = useRouter()
    const handleReprioritize = useCallback(async (direction: 'UP' | 'DOWN') => {
        await updateApplicationAction({
            userId, commiteeParticipationId
        }, { priority: direction })
        refresh()
    }, [userId, commiteeParticipationId, refresh])
    return (
        <>
            {
                showUp && <button className={styles.btn} onClick={() => handleReprioritize('UP')}>
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
            }
            {
                showDown && <button className={styles.btn} onClick={() => handleReprioritize('DOWN')}>
                    <FontAwesomeIcon icon={faArrowDown} />
                </button>
            }
        </>
    )
}
