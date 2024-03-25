'use client'
import GroupSelectionProvider from '@/context/groupSelection'
import type { ReactNode } from 'react'

type PropTypes = {
    children: ReactNode
}

export default function GroupAdminLayout({ children }: PropTypes) {
    return (
        <GroupSelectionProvider>
            {children}
        </GroupSelectionProvider>
    )
}
