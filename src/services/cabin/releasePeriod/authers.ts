import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace CabinReleasePeriodAuthers {
    export const createReleasePeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
    export const readReleasePeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
    export const updateReleasePeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
    export const deleteReleasePeriodAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })
}

