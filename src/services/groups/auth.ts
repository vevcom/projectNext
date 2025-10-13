import { RequirePermission } from '@/auth/auther/RequirePermission'

export const groupAuth = {
    read: RequirePermission.staticFields({ permission: 'GROUP_READ' }),
}
