import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'


export const permissionsAuth = {
    readGroupPermissions: RequirePermission.staticFields({ permission: 'PERMISSION_GROUP_READ' }),
    readPermissionMatrix: RequirePermission.staticFields({ permission: 'PERMISSION_GROUP_READ' }),
    updateGroupPermission: RequirePermission.staticFields({ permission: 'PERMISSION_GROUP_ADMIN' }),

    readDefaultPermissions: RequireNothing.staticFields({}),
    updateDefaultPermissions: RequirePermission.staticFields({ permission: 'PERMISSION_DEFAULT_ADMIN' }),
}
