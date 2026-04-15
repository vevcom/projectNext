'use client'
import styles from './layout.module.scss'
import SlideSidebar from './SlideSidebar'
import React from 'react'
import { usePathname } from 'next/navigation'

type PropTypes = {
    children: React.ReactNode
}

export default function AdminLayout({ children }: PropTypes) {
    const pathname = usePathname()

    // pathname takes form /admin/[currentPath]/... => ['', 'admin', '[currentPath]', ...]
    const currentPath = pathname.split('/').length > 2 ? pathname.split('/')[2] : 'admin'
    return (
        <div className={styles.wrapper}>
            <div className={styles.slideBar}>
                <SlideSidebar currentPath={currentPath} />
            </div>
            <div className={styles.content}>
                { children }
            </div>
        </div>
    )
}
