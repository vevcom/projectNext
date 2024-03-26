'use client'
import styles from './VisibilityAdmin.module.scss'
import useActionCall from '@/hooks/useActionCall'
import { readVisibilityForAdminAction } from '@/actions/visibility/read'
import { useCallback, useEffect } from 'react'

type PropTypes = {
    visibilityId: number
}


export default function VisibilityAdmin({ visibilityId }: PropTypes) {
    const action = useCallback(() => readVisibilityForAdminAction(visibilityId), [visibilityId])
    const { error, data } = useActionCall(action)
    if (!data) return null
    return (
        <div className={styles.VisibilityAdmin}>
            <h2>Administrer synelighet</h2>
            <p>{data.purpose}</p>
            {
                data.type === 'REGULAR' ? (
                    <>{}</>
                ) : (<>
                    <p>{data.message}</p>
                    <p>{data.regular}</p>
                    <p>{data.admin}</p>
                </>)
            }
        </div>
    )
}
