import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'

export const eventTagAuthers = {
    read: RequireNothing.staticFields({}),
    readSpecial: RequireNothing.staticFields({}),
    readAll: RequireNothing.staticFields({}),
    create: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'EVENT_ADMIN' }),
} as const
