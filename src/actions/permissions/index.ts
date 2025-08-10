'use server'

import { action } from '@/actions/action'
import { PermissionMethods } from '@/services/permissions/methods'

export const readPermissionOfGroupAction = action(PermissionMethods.readPermissionsOfGroup)
