import { RequirePermission } from '@/auth/auther/RequirePermission'

export const createEventTagAuther = RequirePermission.staticFields({ permission: 'EVENT_ADMIN' })

export const updateEventTagAuther = RequirePermission.staticFields({ permission: 'EVENT_ADMIN' })

export const destroyEventTagAuther = RequirePermission.staticFields({ permission: 'EVENT_ADMIN' })
