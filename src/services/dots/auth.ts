import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequirePermissionAndUserId } from '@/auth/authorizer/RequirePermissionAndUserId'
import { RequireUserIdOrPermission } from '@/auth/authorizer/RequireUserIdOrPermission'

export const dotAuth = {
    create: RequirePermissionAndUserId.staticFields({ permission: 'DOTS_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'DOTS_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'DOTS_ADMIN' }),
    readForUser: RequireUserIdOrPermission.staticFields({ permission: 'DOTS_ADMIN' }),
    readPage: RequirePermission.staticFields({ permission: 'DOTS_ADMIN' }),
    readWrapperForUser: RequireUserIdOrPermission.staticFields({ permission: 'DOTS_ADMIN' }),
}
