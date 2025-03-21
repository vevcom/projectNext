import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'

export const readEventTagAuther = RequireNothing.staticFields({})
export const readSpecialEventTagAuther = RequireNothing.staticFields({})
export const readAllEventTagsAuther = RequireNothing.staticFields({})

export const createEventTagAuther = RequirePermission.staticFields({ permission: 'EVENT_ADMIN' })

export const updateEventTagAuther = RequirePermission.staticFields({ permission: 'EVENT_ADMIN' })

export const destroyEventTagAuther = RequirePermission.staticFields({ permission: 'EVENT_ADMIN' })
