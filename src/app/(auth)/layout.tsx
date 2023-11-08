import Image from 'next/image'

import styles from './layout.module.scss'

import magiskHatt from '@/images/magisk_hatt.png'

export default function AuthLayout({ children } : { children: React.ReactNode}) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.input}>
                {children}
                </div>
                <div className={styles.image}>
                    <Image alt="en kappemann sin hatt" width={200} src={magiskHatt} />
                </div>
            </div>
        </div>
    )
}