'use client'
import useOnNavigation from '@/hooks/useOnNavigation'
import styles from './SlideSidebar.module.scss'
import type { ReactNode } from 'react'
import { useState } from 'react'

type PropTypes = {
    children: ReactNode
}

/**
 * Component that renders a sidebar that can be toggled on and off.
 * @param children - The children to render in the sidebar.
 * @returns 
 */
export default function SlideSidebar({ children }: PropTypes) {
    const [open, setOpen] = useState(false)

    useOnNavigation(() => {
        setOpen(false)
    })

    return (
        <div className={styles.SlideSidebar}>
            {children}
        </div>
    )
}
