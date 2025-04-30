import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace CabinProductAuthers {
    export const read = RequirePermission.staticFields({
        permission: 'CABIN_CALENDAR_READ'
    })

    export const create = RequirePermission.staticFields({
        permission: 'CABIN_PRODUCTS_ADMIN'
    })

    export const createPrice = RequirePermission.staticFields({
        permission: 'CABIN_PRODUCTS_ADMIN'
    })
}

