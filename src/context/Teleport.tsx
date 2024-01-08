'use client'
import React, { createContext, useState } from 'react'

export const TeleportContext = createContext<{
    teleport: (component: React.ReactNode, id: string) => void,
    remove: (id: string) => void,
} | null>(null)

export default function TeleportProvider({ children }: { children: React.ReactNode }) {
    const [teleportQueue, setTeleportQueue] = useState<{
        node: React.ReactNode
        id: string
    }[]>([])

    const teleport = (component: React.ReactNode, id: string) => {
        setTeleportQueue((prev) => [...prev, {
            node: component,
            id,
        }])
    }

    const remove = (id: string) => setTeleportQueue((prev) => prev.filter((item) => item.id !== id))

    return (
        <TeleportContext.Provider value={{
            teleport,
            remove,
        }}>
            {
                teleportQueue.map(({ node }, index) => (
                    <React.Fragment key={index}>
                        {node}
                    </React.Fragment>
                ))
            }
            {children}
        </TeleportContext.Provider>
    )
}

