import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const groupAuth = {
    read: RequirePermission.staticFields({ permission: 'GROUP_READ' }),
}
