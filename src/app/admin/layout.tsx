'use client'
import styles from './layout.module.scss'
import React from 'react'
import Link from 'next/link'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname } from 'next/navigation'

type PropTypes = {
    children: React.ReactNode
}

export default function RootLayout({ children } : PropTypes) {
    //go back one layer in url
    const pathname = usePathname()
    const href = `/${pathname?.split('/').slice(1, -1).join('/')}` ?? '/admin'

    return (
        <div className={styles.wrapper}>
            <Link className={styles.backLink} href={href}>
                <FontAwesomeIcon icon={faArrowLeft} className={styles.icon}/>
            </Link>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}
