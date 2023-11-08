import React from 'react'
import Image from '@/components/Image/Image'

import styles from './layout.module.scss'

export default function AuthLayout({ children } : { children: React.ReactNode}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.input}>
                    {children}
                </div>
                <div className={styles.image}>
                    <Image name="magisk_hatt" alt="en kappemann sin hatt" width={200}/>
                </div>
            </div>
        </div>
    )
}
