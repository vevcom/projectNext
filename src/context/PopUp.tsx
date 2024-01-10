'use client'
import useOnNavigation from '@/hooks/useOnNavigation'
import React, { createContext, useState } from 'react'

export const PopUpContext = createContext<{
    teleport:(component: React.ReactNode, key: number | string) => void,
    remove: (key: number | string) => void,
        } | null>(null)

export default function PopUpProvider({ children }: { children: React.ReactNode }) {
    const [node, setNode] = useState<React.ReactNode | null>(null)
    const [keyOfCurrentNode, setKeyOfCurrentNode] = useState<number | string | undefined>(undefined)
    useOnNavigation(() => setNode(null), [setNode])

    const teleport = (component: React.ReactNode, key: number | string) => {
        setNode(component)
        setKeyOfCurrentNode(key)
    }

    const remove = (key: number | string) => {
        if (key === undefined) {
            setNode(null)
            setKeyOfCurrentNode(undefined)
            return
        }
        if (key === keyOfCurrentNode) {
            setNode(null)
            setKeyOfCurrentNode(undefined)
        }
    }

    return (
        <PopUpContext.Provider value={{
            teleport,
            remove,
        }}>
            {node}
            {children}
        </PopUpContext.Provider>
    )
}

