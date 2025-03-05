import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace CabinProductAuthers {
    export const readCabinProductAuther = RequirePermission.staticFields({
        permission: 'CABIN_CALENDAR_READ'
    })

    export const createCabinProductAuther = RequirePermission.staticFields({
        permission: 'CABIN_PRODUCTS_ADMIN'
    })

    export const createCabinProductPriceAuther = RequirePermission.staticFields({
        permission: 'CABIN_PRODUCTS_ADMIN'
    })
}

