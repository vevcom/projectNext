import { RequirePermission } from '@/auth/auther/RequirePermission'

export const groupAuthers = {
    read: RequirePermission.staticFields({ permission: 'GROUP_READ' }),
}
