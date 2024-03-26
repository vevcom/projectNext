'use client'
import styles from './VisibilityAdmin.module.scss'
import useActionCall from '@/hooks/useActionCall'
import { readVisibilityForAdminAction } from '@/actions/visibility/read'

type PropTypes = {
    visibilityId: number
}


export default function VisibilityAdmin({ visibilityId }: PropTypes) {
    const { error, data } = useActionCall(readVisibilityForAdminAction)

    return (
        <div className={styles.VisibilityAdmin}>
            { error?.errorCode && <p>{error.errorCode}</p> }
            { data && <p>{data[0].id}</p> }
            { visibility.type }
        </div>
    )
}
