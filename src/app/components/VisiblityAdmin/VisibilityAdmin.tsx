'use client'
import { VisibilityCollapsed } from '@/server/visibility/Types'
import styles from './VisibilityAdmin.module.scss'

type PropTypes = {
    visibility: VisibilityCollapsed
}


export default function VisibilityAdmin({ visibility }: PropTypes) {
    return (
        <div className={styles.VisibilityAdmin}>
            VisibilityAdmin
        </div>
    )
}
