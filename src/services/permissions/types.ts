import type { permissionCategories } from './constants'

export type PermissionCategory = typeof permissionCategories[number]
export type PermissionInfo = {
    name: string,
    description: string,
    category: PermissionCategory,
}

