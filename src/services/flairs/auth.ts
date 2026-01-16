import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const flairAuth = {
    create: RequirePermission.staticFields({ permission: 'FLAIR_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'FLAIR_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'FLAIR_ADMIN' }),
    assign: RequirePermission.staticFields({ permission: 'FLAIR_ADMIN' }),
    read: RequireNothing.staticFields({}),
}
