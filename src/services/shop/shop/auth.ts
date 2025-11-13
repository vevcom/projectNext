import { RequirePermission } from '@/auth/auther/RequirePermission'

export const shopAuth = {
    read: RequirePermission.staticFields({ permission: 'SHOP_READ' }),
    create: RequirePermission.staticFields({ permission: 'SHOP_ADMIN' }),
}
