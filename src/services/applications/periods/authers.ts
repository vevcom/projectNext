import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace ApplicationPeriodAuthers {
    export const readAll = RequirePermission.staticFields({ permission: 'APPLICATION_WRITE' })
    export const read = RequirePermission.staticFields({ permission: 'APPLICATION_WRITE' })
    export const readNumberOfApplications = RequirePermission.staticFields({ permission: 'APPLICATION_WRITE' })
    export const create = RequirePermission.staticFields({ permission: 'APPLICATION_ADMIN' })
    export const update = RequirePermission.staticFields({ permission: 'APPLICATION_ADMIN' })
    export const removeAllApplicationTexts = RequirePermission.staticFields({ permission: 'APPLICATION_ADMIN' })
    export const destroy = RequirePermission.staticFields({ permission: 'APPLICATION_ADMIN' })
}
