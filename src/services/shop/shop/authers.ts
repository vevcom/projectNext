import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace ShopAuthers {
    export const read = RequirePermission.staticFields({ permission: 'SHOP_READ' })
    export const create = RequirePermission.staticFields({ permission: 'SHOP_ADMIN' })
}
