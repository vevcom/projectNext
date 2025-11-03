import { RequirePermission } from '@/auth/auther/RequirePermission'

//TODO: Use authers when refactoring to operations.ts
export const mailingListAuth = {
    create: RequirePermission.staticFields({ permission: 'MAILINGLIST_CREATE' }),
    destroy: RequirePermission.staticFields({ permission: 'MAILINGLIST_DESTROY' }),
    read: RequirePermission.staticFields({ permission: 'MAILINGLIST_READ' }),
    update: RequirePermission.staticFields({ permission: 'MAILINGLIST_UPDATE' }),
} as const
