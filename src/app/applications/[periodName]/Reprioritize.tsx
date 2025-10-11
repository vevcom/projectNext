'use client'
import styles from './Reprioritize.module.scss'
import { updateApplicationAction } from '@/actions/applications/update'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

type PropTypes = {
    showUp?: boolean,
    showDown?: boolean
    userId: number
    commiteeParticipationId: number
}

export default function Reprioritize({ showUp, showDown, userId, commiteeParticipationId }: PropTypes) {
    const { refresh } = useRouter()
    const [error, setError] = useState<string | null>(null)

    const handleShowError = useCallback((e: string) => {
        setError(e)
        setTimeout(() => {
            setError(null)
        }, 3000)
    }, [])

    const handleReprioritize = useCallback(async (direction: 'UP' | 'DOWN') => {
        // TODO: Merge action arguments into one object?
        const res = await updateApplicationAction({
            params: {
                userId, commiteeParticipationId
            }
        }, {
            data: {
                priority: direction,
            },
        })
        if (!res.success) {
            handleShowError(
                res.error?.length ?
                    res.error.map(e => e.message).join(' ') :
                    'An unknown error occurred while reprioritizing.'
            )
            return
        }
        refresh()
    }, [userId, commiteeParticipationId, refresh, handleShowError])

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
            { error && <i className={styles.error}>{error}</i> }
        </>
    )
}
