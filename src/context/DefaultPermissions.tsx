'use client'
import type { Permission } from "@prisma/client"
import { createContext } from "react"

type PropTypes = {
    children: React.ReactNode,
    defaultPermissions: Permission[],
}

/**
 * This is a context thatsaves the default permissions for all users on the client
 * It is manly used for the useUser hook, when no user is logged in.
 */
export const DefaultPermissionsContext = createContext<{
    defaultPermissions: Permission[],
} | null>(null)

export default function DefaultPermissionsProvider({ children, defaultPermissions }: PropTypes) {
    return (
        <DefaultPermissionsContext.Provider value={{ defaultPermissions }}>
            {children}
        </DefaultPermissionsContext.Provider>
    )
}

