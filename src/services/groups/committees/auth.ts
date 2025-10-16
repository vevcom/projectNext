import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionOrGroupAdmin } from '@/auth/auther/RequirePermissionOrGroupAdmin'

export const committeeAuth = {
    readAll: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    read: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    readMembers: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    readArticle: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    readParagraph: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    updateParagraphContent: RequirePermissionOrGroupAdmin.staticFields({ permission: 'COMMITTEE_UPDATE' })
}
