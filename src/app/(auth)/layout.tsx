import React from 'react'
import ImageLink from '@/app/components/Image/link/ImageLink'
import styles from './layout.module.scss'

type PropTypes = {
    children: React.ReactNode
}

export default function AuthLayout({ children } : PropTypes) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.input}>
                    {children}
                </div>
                <div className={styles.image}>
                    <ImageLink name="magisk_hatt" alt="en kappemann sin hatt" width={200}/>
                </div>
            </div>
        </div>
    )
}
