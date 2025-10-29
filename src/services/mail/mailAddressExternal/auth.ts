import { RequirePermission } from '@/auth/auther/RequirePermission'

//TODO: Use authers when refactoring to operations.ts
export const mailAddressExternalAuth = {
    create: RequirePermission.staticFields({ permission: 'MAILADDRESS_EXTERNAL_CREATE' }),
    destroy: RequirePermission.staticFields({ permission: 'MAILADDRESS_EXTERNAL_DESTROY' }),
    read: RequirePermission.staticFields({ permission: 'MAILADDRESS_EXTERNAL_READ' }),
    update: RequirePermission.staticFields({ permission: 'MAILADDRESS_EXTERNAL_UPDATE' }),
} as const
