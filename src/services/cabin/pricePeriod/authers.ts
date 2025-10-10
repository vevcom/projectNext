import { RequirePermission } from '@/auth/auther/RequirePermission'

const baseAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })

export const cabinPricePeriodAuthers = {
    create: baseAuther,
    read: baseAuther,
    readPublicPeriods: RequirePermission.staticFields({ permission: 'CABIN_CALENDAR_READ' }),
    update: baseAuther,
    destroy: baseAuther,
}
