import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'

export const eventTagAuth = {
    create: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
    readSpecial: RequireNothing.staticFields({}),
    read: RequireNothing.staticFields({}),
    readAll: RequireNothing.staticFields({}),
    update: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
}
