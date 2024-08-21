'use client'
import useOnNavigation from '@/hooks/useOnNavigation'
import React, { createContext, useState, useCallback } from 'react'

type PopUpContextType = {
    teleport: (component: React.ReactNode, key: number | string) => void,
    remove: (key: number | string) => void,
        } | null

export const PopUpContext = createContext<PopUpContextType>(null)

export default function PopUpProvider({ children }: { children: React.ReactNode }) {
    const [node, setNode] = useState<React.ReactNode | null>(null)
    const [keyOfCurrentNode, setKeyOfCurrentNode] = useState<number | string | undefined>(undefined)
    useOnNavigation(() => setNode(null))

    const teleport = useCallback((component: React.ReactNode, key: number | string) => {
        setNode(component)
        setKeyOfCurrentNode(key)
    }, []) // Add dependencies if necessary

    const remove = useCallback((key: number | string) => {
        if (key === undefined) {
            setNode(null)
            setKeyOfCurrentNode(undefined)
            return
        }
        if (key === keyOfCurrentNode) {
            setNode(null)
            setKeyOfCurrentNode(undefined)
        }
    }, [keyOfCurrentNode])

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

