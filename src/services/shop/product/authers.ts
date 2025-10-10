import { RequirePermission } from '@/auth/auther/RequirePermission'

export const productAuthers = {
    read: RequirePermission.staticFields({ permission: 'PRODUCT_READ' }),
    create: RequirePermission.staticFields({ permission: 'PRODUCT_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'PRODUCT_ADMIN' }),
    createShopConnection: RequirePermission.staticFields({ permission: 'SHOP_ADMIN' }),
}
