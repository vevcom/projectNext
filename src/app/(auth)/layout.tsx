import styles from './layout.module.scss'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'
import React from 'react'

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
                    <CmsImage name="auth_icon" alt="en kappemann sin hatt" width={200}/>
                </div>
            </div>
        </div>
    )
}
