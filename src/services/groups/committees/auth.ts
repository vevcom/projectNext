import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequirePermissionOrGroupAdmin } from '@/auth/authorizer/RequirePermissionOrGroupAdmin'

export const committeeAuth = {
    create: RequirePermission.staticFields({ permission: 'COMMITTEE_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'COMMITTEE_ADMIN' }),
    readAll: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    read: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    readMembers: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    readArticle: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    readParagraph: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    destroy: RequirePermission.staticFields({ permission: 'COMMITTEE_ADMIN' }),
    updateParagraphContent: RequirePermissionOrGroupAdmin.staticFields({ permission: 'COMMITTEE_ADMIN' }),
    updateLogo: RequirePermissionOrGroupAdmin.staticFields({ permission: 'COMMITTEE_ADMIN' }),
    updateArticle: RequirePermissionOrGroupAdmin.staticFields({ permission: 'COMMITTEE_ADMIN' }),
}
