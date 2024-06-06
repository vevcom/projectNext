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

/**
 * A context that holds server fetched default permissions for use on the client
 * @param children - the children to render with access to the default permissions context
 * @param defaultPermissions - the default permissions to save in the context
 * @returns 
 */
export default function DefaultPermissionsProvider({ children, defaultPermissions }: PropTypes) {
    return (
        <DefaultPermissionsContext.Provider value={{ defaultPermissions }}>
            {children}
        </DefaultPermissionsContext.Provider>
    )
}

