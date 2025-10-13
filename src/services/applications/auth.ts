import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'

export const applicationAuth = {
    readForUser: RequireUserIdOrPermission.staticFields({ permission: 'APPLICATION_ADMIN' }),
    create: RequireUserIdOrPermission.staticFields({ permission: 'APPLICATION_ADMIN' }),
    update: RequireUserIdOrPermission.staticFields({ permission: 'APPLICATION_ADMIN' }),
    destroy: RequireUserIdOrPermission.staticFields({ permission: 'APPLICATION_ADMIN' }),
}
