import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'


export namespace PermissionAuthers {
    export const readGroupPermissions = RequirePermission.staticFields({ permission: 'PERMISSION_GROUP_READ' })
    export const readPermissionMatrix = RequirePermission.staticFields({ permission: 'PERMISSION_GROUP_READ' })
    export const updateGroupPermission = RequirePermission.staticFields({ permission: 'PERMISSION_GROUP_ADMIN' })

    export const readDefaultPermissions = RequireNothing.staticFields({})
    export const updateDefaultPermissions = RequirePermission.staticFields({ permission: 'PERMISSION_DEFAULT_ADMIN' })
}
