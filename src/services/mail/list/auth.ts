import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const mailingListAuth = {
    create: RequirePermission.staticFields({ permission: 'MAILINGLIST_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'MAILINGLIST_READ' }),
    update: RequirePermission.staticFields({ permission: 'MAILINGLIST_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'MAILINGLIST_ADMIN' }),
} as const
