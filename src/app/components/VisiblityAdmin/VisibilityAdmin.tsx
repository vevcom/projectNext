'use client'
import styles from './VisibilityAdmin.module.scss'
import useActionCall from '@/hooks/useActionCall'
import { readVisibilityForAdminAction } from '@/actions/visibility/read'
import { useCallback } from 'react'
import VisibilityLevelAdmin from './VisibilityLevelAdmin'

type PropTypes = {
    visibilityId: number
}


export default function VisibilityAdmin({ visibilityId }: PropTypes) {
    const action = useCallback(() => readVisibilityForAdminAction(visibilityId), [visibilityId])
    const { data } = useActionCall(action)
    console.log(data)
    if (!data) return null
    return (
        <div className={styles.VisibilityAdmin}>
            <h2>Administrer synelighet</h2>
            <p>Synelighet for: {data.purpose}</p>
            {
                data.type === 'REGULAR' ? (<>
                    <VisibilityLevelAdmin level='REGULAR' levelName='Synelig' data={data.regular} />
                    <VisibilityLevelAdmin level='ADMIN' levelName='Admin' data={data.admin} />
                </>) : (<>
                    <p>{data.message}</p>
                    <p>{data.regular}</p>
                    <p>{data.admin}</p>
                </>)
            }
        </div>
    )
}
