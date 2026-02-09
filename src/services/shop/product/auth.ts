import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const productAuth = {
    read: RequirePermission.staticFields({ permission: 'PRODUCT_READ' }),
    create: RequirePermission.staticFields({ permission: 'PRODUCT_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'PRODUCT_ADMIN' }),
    createShopConnection: RequirePermission.staticFields({ permission: 'SHOP_ADMIN' }),
}
