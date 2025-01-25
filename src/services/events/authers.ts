import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'

export const createEventAuther = RequirePermission.staticFields({ permission: 'EVENT_CREATE' })

// TODO: Replace beneath with proper authers
export const readEventAuther = RequireNothing.staticFields({})
export const readCurrentEventsAuther = RequireNothing.staticFields({})
export const readArchivedEventsPageAuther = RequireNothing.staticFields({})

export const updateEventAuther = RequireNothing.staticFields({})

export const destroyEventAuther = RequireNothing.staticFields({})
