'use server'

import { action } from '@/services/action'
import { permissionMethods } from '@/services/permissions/methods'

export const readPermissionOfGroupAction = action(permissionMethods.readPermissionsOfGroup)
export const readPermissionMatrixAction = action(permissionMethods.readPermissionMatrix)
export const readDefaultPermissionsAction = action(permissionMethods.readDefaultPermissions)
export const updateDefaultPermissionsAction = action(permissionMethods.updateDefaultPermissions)
export const updateGroupPermissionAction = action(permissionMethods.updateGroupPermission)
