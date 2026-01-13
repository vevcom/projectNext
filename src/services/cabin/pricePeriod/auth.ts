import { RequirePermission } from '@/auth/authorizer/RequirePermission'

const baseAuthorizer = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })

export const cabinPricePeriodAuth = {
    create: baseAuthorizer,
    read: baseAuthorizer,
    readPublicPeriods: RequirePermission.staticFields({ permission: 'CABIN_CALENDAR_READ' }),
    update: baseAuthorizer,
    destroy: baseAuthorizer,
}
