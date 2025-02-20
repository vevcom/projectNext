import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionOrGroupAdmin } from '@/auth/auther/RequirePermissionOrGroupAdmin'

export const interestGroupAuthers = {
    create: RequirePermission.staticFields({ permission: 'INTEREST_GROUP_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'INTEREST_GROUP_READ' }),
    readMany: RequirePermission.staticFields({ permission: 'INTEREST_GROUP_READ' }),
    update: RequirePermissionOrGroupAdmin.staticFields({ permission: 'INTEREST_GROUP_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'INTEREST_GROUP_ADMIN' }),
}
