import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const mailAddressExternalAuth = {
    create: RequirePermission.staticFields({ permission: 'MAILADDRESS_EXTERNAL_CREATE' }),
    destroy: RequirePermission.staticFields({ permission: 'MAILADDRESS_EXTERNAL_DESTROY' }),
    readMany: RequirePermission.staticFields({ permission: 'MAILADDRESS_EXTERNAL_READ' }),
    read: RequirePermission.staticFields({ permission: 'MAILADDRESS_EXTERNAL_READ' }),
    update: RequirePermission.staticFields({ permission: 'MAILADDRESS_EXTERNAL_UPDATE' }),
} as const
