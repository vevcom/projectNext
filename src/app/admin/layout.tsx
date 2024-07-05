'use client'
import { usePathname } from 'next/navigation'
import styles from './layout.module.scss'
import React from 'react'
import BackButton from './BackButton'
import SlideSidebar from './SlideSidebar'

type PropTypes = {
    children: React.ReactNode
}

export default function AdminLayout({ children }: PropTypes) {
    const pathname = usePathname()
    const href = `/${pathname?.split('/').slice(1, -1).join('/')}` ?? '/admin'

    // pathname takes form /admin/[currentPath]/... => ['', 'admin', '[currentPath]', ...]
    const currentPath = pathname.split('/').length > 2 ? pathname.split('/')[2] : 'admin'
    return (
        <div className={styles.wrapper}>
            <SlideSidebar currentPath={currentPath} />
            <BackButton className={styles.backButton} />
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}
