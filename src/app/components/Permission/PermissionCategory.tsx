import Permission from './Permission'
import { PermissionConfig } from '@/server/permissionRoles/ConfigVars'
import { Permission as PermissionEnum } from '@prisma/client'
import type { PermissiobCategory } from '@/server/permissionRoles/Types'
import type { ReactNode } from 'react'


type PropTypes = {
    category: PermissiobCategory
    renderBesidePermission?: (permission: PermissionEnum) => ReactNode
}

/**
 * Displays all permissions in a category
 * @param category - The category of permissions to display
 * @returns
 */
export default function PermissionCategory({ category, renderBesidePermission }: PropTypes) {
    const permissionsInCategory = Object.values(PermissionEnum).filter(permission =>
        PermissionConfig[permission].category === category
    )

    return (
        <div>
            <h2>{category}</h2>
            {
                permissionsInCategory.map(permission => (
                    <Permission key={permission} permission={permission} displayCategory={false}>
                        {renderBesidePermission ? renderBesidePermission(permission) : <></>}
                    </Permission>
                ))
            }
        </div>
    )
}
