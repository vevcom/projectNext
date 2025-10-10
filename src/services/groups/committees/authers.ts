import { RequirePermission } from '@/auth/auther/RequirePermission'

export const committeeAuthers = {
    read: RequirePermission.staticFields({ permission: 'COMMITTEE_READ' }),
}
