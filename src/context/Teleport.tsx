'use client'
import React, { createContext, useState } from 'react'

export const TeleportContext = createContext<{
    teleport: (component: React.ReactNode) => void,
    remove: () => void,
} | null>(null)

export default function TeleportProvider({ children }: { children: React.ReactNode }) {
    const [node, setNode] = useState<React.ReactNode | null>(null)

    const teleport = (component: React.ReactNode) => {
        setNode(component)
    }

    const remove = () => {
        setNode(null)
    }

    return (
        <TeleportContext.Provider value={{
            teleport,
            remove,
        }}>
            {node}
            {children}
        </TeleportContext.Provider>
    )
}

