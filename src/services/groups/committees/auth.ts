import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequirePermissionOrGroupAdmin } from '@/auth/authorizer/RequirePermissionOrGroupAdmin'

export const committeeAuth = {
    create: RequirePermission.staticFields({ permission: 'COMMITTEE_CREATE' }),
    update: RequirePermission.staticFields({ permission: 'COMMITTEE_UPDATE' }),
    readAll: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    read: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    readMembers: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    readArticle: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    readParagraph: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    destroy: RequirePermission.staticFields({ permission: 'COMMITTEE_DESTROY' }),
    updateParagraphContent: RequirePermissionOrGroupAdmin.staticFields({ permission: 'COMMITTEE_UPDATE' }),
    updateLogo: RequirePermissionOrGroupAdmin.staticFields({ permission: 'COMMITTEE_UPDATE' }),
    updateArticle: RequirePermissionOrGroupAdmin.staticFields({ permission: 'COMMITTEE_UPDATE' }),
}
