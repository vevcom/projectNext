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

    return (
        <div className={styles.VisibilityAdmin}>
           
        </div>
    )
}
