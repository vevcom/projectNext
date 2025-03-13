import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace LicenseAuthers {
    export const create = RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' })
    export const read = RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' })
    export const update = RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' })
    export const destroy = RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' })
}
