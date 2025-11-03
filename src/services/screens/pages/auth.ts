import { RequirePermission } from '@/auth/auther/RequirePermission'

export const screenPageAuth = {
    //TODO: Service not refactored to serviceoperations.... use these authers then.
    create: RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'SCREEN_READ' }),
    readAll: RequirePermission.staticFields({ permission: 'SCREEN_READ' }),
    update: RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' }),
} as const
