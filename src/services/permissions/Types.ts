import type { permissionCategories } from './config'

export type PermissionCategory = typeof permissionCategories[number]
export type PermissionInfo = {
    name: string,
    description: string,
    category: PermissionCategory,
}

