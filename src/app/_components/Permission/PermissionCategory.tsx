import Permission from './Permission'
import styles from './PermissionCategory.module.scss'
import { PermissionConfig } from '@/services/permissions/config'
import { Permission as PermissionEnum } from '@prisma/client'
import type { PermissiobCategory } from '@/services/permissions/Types'
import type { ReactNode } from 'react'

export type PropTypes = {
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
