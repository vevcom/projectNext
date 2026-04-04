import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const mailingListAuth = {
    create: RequirePermission.staticFields({ permission: 'MAILINGLIST_CREATE' }),
    read: RequirePermission.staticFields({ permission: 'MAILINGLIST_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'MAILINGLIST_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'MAILINGLIST_ADMIN' }),
} as const
