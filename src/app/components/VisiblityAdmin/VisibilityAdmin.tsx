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
            <div className={styles.info}>
                <h1>Administrer synelighet</h1>
                <i>Synelighet for: {data.purpose}</i>
            </div>
            {
                data.type === 'REGULAR' ? (<>
                <div className={styles.borderBottom}>
                    <VisibilityLevelAdmin level='REGULAR' levelName='Synelig' data={data.regular} />
                </div>
                <div>
                    <VisibilityLevelAdmin level='ADMIN' levelName='Admin' data={data.admin} />
                </div>
                </>) : (<>
                    <p>{data.message}</p>
                    <p>{data.regular}</p>
                    <p>{data.admin}</p>
                </>)
            }
        </div>
    )
}
