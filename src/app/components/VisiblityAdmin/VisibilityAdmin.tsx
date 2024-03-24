'use client'
import { VisibilityCollapsed } from '@/server/visibility/Types'
import styles from './VisibilityAdmin.module.scss'
import useActionCall from '@/hooks/useActionCall'
import { readGroupsAction } from '@/actions/groups/read'

type PropTypes = {
    visibility: VisibilityCollapsed
}


export default function VisibilityAdmin({ visibility }: PropTypes) {
    const { error, data } = useActionCall(readGroupsAction)

    return (
        <div className={styles.VisibilityAdmin}>
            VisibilityAdmin
        </div>
    )
}
