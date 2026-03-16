import Permission from './Permission'
import styles from './PermissionCategory.module.scss'
import { permissionConfig } from '@/services/permissions/constants'
import { Permission as PermissionEnum } from '@/prisma-generated-pn-types'
import type { PermissionCategory } from '@/services/permissions/types'
import type { ReactNode } from 'react'

export type PropTypes = {
    category: PermissionCategory
    renderBesidePermission?: (permission: PermissionEnum) => ReactNode
}

/**
 * Displays all permissions in a category
 * @param category - The category of permissions to display
 * @returns
 */
export default function PermissionCategory({ category, renderBesidePermission }: PropTypes) {
    const permissionsInCategory = Object.values(PermissionEnum).filter(permission =>
        permissionConfig[permission].category === category
    )

    return (
        <div className={styles.PermissionCategory}>
            <h2>{category.toUpperCase()}</h2>
            <div className={styles.list}>
                {
                    permissionsInCategory.map(permission => (
                        <Permission key={permission} permission={permission} displayCategory={false}>
                            {renderBesidePermission ? renderBesidePermission(permission) : <></>}
                        </Permission>
                    ))
                }
            </div>
        </div>
    )
}
