'use client'
import React, { createContext, useState } from 'react'
import { v4 as uuid } from 'uuid'

export const TeleportContext = createContext<{
    teleport: (component: React.ReactNode) => (() => void),
} | null>(null)

export default function TeleportProvider({ children }: { children: React.ReactNode }) {
    const [teleportQueue, setTeleportQueue] = useState<{
        node: React.ReactNode
        id: string
    }[]>([])

    const teleport = (component: React.ReactNode) => {
        const id = uuid()
        setTeleportQueue((prev) => [...prev, {
            node: component,
            id,
        }])
        const remove = () => {
            setTeleportQueue((prev) => prev.filter((item) => item.id !== id))
        }
        return remove
    }

    return (
        <TeleportContext.Provider value={{
            teleport,
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

