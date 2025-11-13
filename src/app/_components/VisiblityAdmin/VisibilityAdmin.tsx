'use client'
import styles from './VisibilityAdmin.module.scss'
import type { VisibilityMatrix } from '@/services/visibility/types'


type PropTypes = {
    visibility: VisibilityMatrix
}

export default function VisibilityAdmin({ visibility }: PropTypes) {
    console.log(visibility)
    return (
        <div className={styles.VisibilityAdmin}>
            <h2>Synelighet!</h2>
        </div>
    )
}
