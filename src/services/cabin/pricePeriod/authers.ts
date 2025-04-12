import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace CabinPricePeriodAuthers {
    export const create = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
    export const read = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
    export const update = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
    export const destroy = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
}

