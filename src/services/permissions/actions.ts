'use server'

import { action } from '@/services/action'
import { permissionOperations } from '@/services/permissions/operations'

export const readPermissionOfGroupAction = action(permissionOperations.readPermissionsOfGroup)
export const readPermissionMatrixAction = action(permissionOperations.readPermissionMatrix)
export const readDefaultPermissionsAction = action(permissionOperations.readDefaultPermissions)
export const updateDefaultPermissionsAction = action(permissionOperations.updateDefaultPermissions)
export const updateGroupPermissionAction = action(permissionOperations.updateGroupPermission)
