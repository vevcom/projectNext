import { PermissionConfig } from '@/server/permissionRoles/ConfigVars'
import type { ReactNode } from 'react'
import type { Permission as PermissionT } from '@prisma/client'

type PropTypes = {
    permission: PermissionT
    displayCategory?: boolean
    children?: ReactNode
}

/**
 * Display a permission in a nice way by getting info from the permission config object.
 * @param permission - The permission to display ex. USERS_READ
 * @param children - Displayed to the right of the content
 * @param displayCategory - Display which category the permission is from (default true)
 * @returns
 */
export default function Permission({ permission, children, displayCategory = true }: PropTypes) {
    const permissionInfo = PermissionConfig[permission]

    return (
        <div>
            <h3>{permissionInfo.name}</h3>
            <h5>{permission}</h5>
            <p>{permissionInfo.description}</p>
            {displayCategory ? <p>{permissionInfo.category}</p> : <></>}
            {children}
        </div>
    )
}
