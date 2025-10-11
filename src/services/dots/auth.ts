import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUserId } from '@/auth/auther/RequirePermissionAndUserId'
import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'

export const dotAuth = {
    create: RequirePermissionAndUserId.staticFields({ permission: 'DOTS_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'DOTS_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'DOTS_ADMIN' }),
    readForUser: RequireUserIdOrPermission.staticFields({ permission: 'DOTS_ADMIN' }),
    readPage: RequirePermission.staticFields({ permission: 'DOTS_ADMIN' }),
    readWrapperForUser: RequireUserIdOrPermission.staticFields({ permission: 'DOTS_ADMIN' }),
}
