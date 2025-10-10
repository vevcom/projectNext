import { RequirePermission } from '@/auth/auther/RequirePermission'

const baseAuther = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })

export const cabinReleasePeriodAuthers = {
    createReleasePeriodAuther: baseAuther,
    readReleasePeriodAuther: baseAuther,
    updateReleasePeriodAuther: baseAuther,
    deleteReleasePeriodAuther: baseAuther,
}

