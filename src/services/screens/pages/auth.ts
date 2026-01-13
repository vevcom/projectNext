import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const screenPageAuth = {
    //TODO: Service not refactored to serviceoperations.... use these authorizers then.
    create: RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'SCREEN_READ' }),
    readAll: RequirePermission.staticFields({ permission: 'SCREEN_READ' }),
    update: RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' }),
} as const
