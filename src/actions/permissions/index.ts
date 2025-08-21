'use server'

import { action } from '@/actions/action'
import { PermissionMethods } from '@/services/permissions/methods'

export const readPermissionOfGroupAction = action(PermissionMethods.readPermissionsOfGroup)
export const readPermissionMatrixAction = action(PermissionMethods.readPermissionMatrix)
export const readDefaultPermissionsAction = action(PermissionMethods.readDefaultPermissions)
export const updateDefaultPermissionsAction = action(PermissionMethods.updateDefaultPermissions)
export const updateGroupPermissionAction = action(PermissionMethods.updateGroupPermission)
