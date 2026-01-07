import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequirePermissionOrGroupAdmin } from '@/auth/authorizer/RequirePermissionOrGroupAdmin'

export const interestGroupAuth = {
    create: RequirePermission.staticFields({ permission: 'INTEREST_GROUP_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'INTEREST_GROUP_READ' }),
    readMany: RequirePermission.staticFields({ permission: 'INTEREST_GROUP_READ' }),
    update: RequirePermissionOrGroupAdmin.staticFields({ permission: 'INTEREST_GROUP_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'INTEREST_GROUP_ADMIN' }),
    readSpecialCmsParagraphGeneralInfo: RequirePermission.staticFields({ permission: 'INTEREST_GROUP_READ' }),
    updateSpecialCmsParagraphContentGeneralInfo: RequirePermission.staticFields({ permission: 'INTEREST_GROUP_ADMIN' }),
    updateArticleSection: RequirePermissionOrGroupAdmin.staticFields({ permission: 'INTEREST_GROUP_ADMIN' }),
}
