import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUserId } from '@/auth/auther/RequirePermissionAndUserId'
import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'

export namespace DotAuthers {
    export const create = RequirePermissionAndUserId.staticFields({ permission: 'DOTS_ADMIN' })
    export const update = RequirePermission.staticFields({ permission: 'DOTS_ADMIN' })
    export const destroy = RequirePermission.staticFields({ permission: 'DOTS_ADMIN' })
    export const readForUser = RequireUserIdOrPermission.staticFields({ permission: 'DOTS_ADMIN' })
    export const readPage = RequirePermission.staticFields({ permission: 'DOTS_ADMIN' })
    export const readWrapperForUser = RequireUserIdOrPermission.staticFields({ permission: 'DOTS_ADMIN' })
}
