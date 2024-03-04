'use client'

import Form from '@/app/components/Form/Form'
import styles from './OmbulAdmin.module.scss'

type PropTypes = {
    canUpdate: boolean
    canDestroy: boolean
}

export default function OmbulAdmin({ canUpdate, canDestroy }: PropTypes) {
    return (
        <div className={styles.OmbulAdmin}>
            {
                canDestroy && (
                    
                )
            }
        </div>
    )
}