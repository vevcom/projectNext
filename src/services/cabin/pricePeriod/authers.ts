import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace CabinPricePeriodAuthers {
    export const create = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
    export const read = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
    export const readPublicPeriods = RequirePermission.staticFields({ permission: 'CABIN_CALENDAR_READ' })
    export const update = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
    export const destroy = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
}

