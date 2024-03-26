'use client'
import styles from './VisibilityAdmin.module.scss'
import useActionCall from '@/hooks/useActionCall'
import { readVisibilityForAdminAction } from '@/actions/visibility/read'
import { useCallback } from 'react'

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
            <p>{data.purpose}</p>
            {
                data.type === 'REGULAR' ? (
                    <>{
                        data.regular.map(requiement =>
                            <div key={requiement.groups[0]?.id || requiement.name}>
                                <p>{requiement.name}</p>
                                {
                                    requiement.groups.map(group =>
                                        <p key={group.id}>{group.name}</p>
                                    )
                                }
                            </div>
                        )
                    }</>
                ) : (<>
                    <p>{data.message}</p>
                    <p>{data.regular}</p>
                    <p>{data.admin}</p>
                </>)
            }
        </div>
    )
}
