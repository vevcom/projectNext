import { RequirePermission } from '@/auth/auther/RequirePermission'

export const licenseAuthers = {
    create: RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' }),
}
