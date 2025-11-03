import { RequirePermission } from '@/auth/auther/RequirePermission'

export const screenAuth = {
    create: RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'SCREEN_READ' }),
    readAll: RequirePermission.staticFields({ permission: 'SCREEN_READ' }),
    update: RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' }),
    movePage: RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' }),
} as const
