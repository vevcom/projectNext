import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'

export namespace ApplicationAuthers {
    export const readForUser = RequireUserIdOrPermission.staticFields({ permission: 'APPLICATION_ADMIN' })
    export const create = RequireUserIdOrPermission.staticFields({ permission: 'APPLICATION_ADMIN' })
    export const update = RequireUserIdOrPermission.staticFields({ permission: 'APPLICATION_ADMIN' })
}
