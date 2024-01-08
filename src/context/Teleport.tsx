'use client'
import React, { createContext, useState } from 'react'

export const TeleportContext = createContext<{
    teleport: (component: React.ReactNode) => void,
    setTeleportQueue: (teleportQueue: React.ReactNode[]) => void,
} | null>(null)

export default function TeleportProvider({ children }: { children: React.ReactNode }) {
    const [teleportQueue, setTeleportQueue] = useState<React.ReactNode[]>([])

    const teleport = (component: React.ReactNode) => {
        setTeleportQueue([...teleportQueue, component])
    }

    return (
        <TeleportContext.Provider value={{
            teleport,
            setTeleportQueue,
        }}>
            {
                teleportQueue.map((component, index) => (
                    <React.Fragment key={index}>
                        {component}
                    </React.Fragment>
                ))
            }
            {children}
        </TeleportContext.Provider>
    )
}

