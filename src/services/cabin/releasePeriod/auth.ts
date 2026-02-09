import { RequirePermission } from '@/auth/authorizer/RequirePermission'

const baseAuthorizer = RequirePermission.staticFields({ permission: 'CABIN_ADMIN' })

export const cabinReleasePeriodAuth = {
    createReleasePeriodAuthorizer: baseAuthorizer,
    readReleasePeriodAuthorizer: baseAuthorizer,
    updateReleasePeriodAuthorizer: baseAuthorizer,
    deleteReleasePeriodAuthorizer: baseAuthorizer,
}

