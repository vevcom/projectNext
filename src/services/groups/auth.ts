import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequirePermissionOrGroupAdmin } from '@/auth/authorizer/RequirePermissionOrGroupAdmin'

export const groupAuth = {
    read: RequirePermission.staticFields({ permission: 'GROUP_READ' }),
    admin: RequirePermission.staticFields({ permission: 'GROUP_ADMIN' }),
    manageMembership: RequirePermissionOrGroupAdmin.staticFields({ permission: 'GROUP_ADMIN' }),
}
