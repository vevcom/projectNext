import { RequirePermission } from '@/auth/auther/RequirePermission'

export const committeeAuth = {
    read: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
}
