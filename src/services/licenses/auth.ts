import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const licenseAuth = {
    create: RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' }),
}
