'use client'
import styles from './layout.module.scss'
import BackButton from './BackButton'
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
            <SlideSidebar currentPath={currentPath}>
                {children}
            </SlideSidebar>
            <BackButton className={styles.backButton} />
        </div>
    )
}
