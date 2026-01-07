import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const eventTagAuth = {
    create: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
    readSpecial: RequireNothing.staticFields({}),
    read: RequireNothing.staticFields({}),
    readAll: RequireNothing.staticFields({}),
    update: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
}
