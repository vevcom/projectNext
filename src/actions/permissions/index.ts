import { action } from '@/actions/action'
import { PermissionMethods } from '@/services/permissions/methods'

export const readPermissionsOfUserAction = action(PermissionMethods.readPermissionsOfUser)
export const readDefaultPermissionsAction = action(PermissionMethods.readDefaultPermissions)

export const updateGroupPermissionAction = action(PermissionMethods.updateGroupPermissions)
export const updateDefaultPermissionsAction = action(PermissionMethods.updateDefaultPermissions)
