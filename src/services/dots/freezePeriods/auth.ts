import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequireUser } from '@/auth/authorizer/RequireUser'

export const dotFreezePeriodAuth = {
    create: RequirePermission.staticFields({ permission: 'DOTS_ADMIN' }),
    readAll: RequireUser.staticFields({}),
    update: RequirePermission.staticFields({ permission: 'DOTS_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'DOTS_ADMIN' }),
} as const
