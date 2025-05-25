import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace ProductAuthers {
    export const read = RequirePermission.staticFields({ permission: 'PRODUCT_READ' })
    export const create = RequirePermission.staticFields({ permission: 'PRODUCT_ADMIN' })
    export const update = RequirePermission.staticFields({ permission: 'PRODUCT_ADMIN' })
    export const createShopConnection = RequirePermission.staticFields({ permission: 'SHOP_ADMIN' })
}
