'use client'
import React, { createContext, useState } from 'react'

export const PopUpContext = createContext<{
    teleport: (component: React.ReactNode) => void,
    remove: () => void,
} | null>(null)

export default function PopUpProvider({ children }: { children: React.ReactNode }) {
    const [node, setNode] = useState<React.ReactNode | null>(null)

    const teleport = (component: React.ReactNode) => {
        setNode(component)
    }

    const remove = () => {
        setNode(null)
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

