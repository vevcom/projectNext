'use client'
import styles from './VisibilityAdmin.module.scss'
import useActionCall from '@/hooks/useActionCall'
import { readGroupsAction } from '@/actions/groups/read'
import type { VisibilityCollapsed } from '@/server/visibility/Types'

type PropTypes = {
    visibility: VisibilityCollapsed
}


export default function VisibilityAdmin({ visibility }: PropTypes) {
    const { error, data } = useActionCall(readGroupsAction)

    return (
        <div className={styles.VisibilityAdmin}>
            { error?.errorCode && <p>{error.errorCode}</p> }
            { data && <p>{data[0].id}</p> }
            { visibility.type }
        </div>
    )
}
