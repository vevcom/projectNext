'use client'

import React, { createContext, useContext, useState } from 'react'

type PageTitleContextType = {
    title: string
    setTitle: (t: string) => void
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined)

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
    const [title, setTitle] = useState('')
    return (
        <PageTitleContext.Provider value={{ title, setTitle }}>
            {children}
        </PageTitleContext.Provider>
    )
}

export function usePageTitle() {
    const ctx = useContext(PageTitleContext)
    if (!ctx) throw new Error('usePageTitle must be used within PageTitleProvider')
    return ctx
}
