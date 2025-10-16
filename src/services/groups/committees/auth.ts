import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionOrGroupAdmin } from '@/auth/auther/RequirePermissionOrGroupAdmin'

export const committeeAuth = {
    read: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
    updateCmsParagraphContent: RequirePermissionOrGroupAdmin.staticFields({ permission: 'COMMITTEE_UPDATE' })
}
