import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionOrGroupAdmin } from '@/auth/auther/RequirePermissionOrGroupAdmin'

export namespace InterestGroupAuthers {
    export const create = RequirePermission.staticFields({ permission: 'INTEREST_GROUP_ADMIN' });
    export const read = RequirePermission.staticFields({ permission: 'INTEREST_GROUP_READ' });
    export const readMany = RequirePermission.staticFields({ permission: 'INTEREST_GROUP_READ' });
    export const update = RequirePermissionOrGroupAdmin.staticFields({ permission: 'INTEREST_GROUP_ADMIN' });
    export const destroy = RequirePermission.staticFields({ permission: 'INTEREST_GROUP_ADMIN' });
}
