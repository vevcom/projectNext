'use server'

import { action } from '@/services/action'
import { eventMethods } from '@/services/events/methods'

export const createEventAction = action(eventMethods.create)

export const destroyEventAction = action(eventMethods.destroy)

export const readCurrentEventsAction = action(eventMethods.readManyCurrent)
export const readEventAction = action(eventMethods.read)
export const readArchivedEventsPageAction = action(eventMethods.readManyArchivedPage)

export const updateEventAction = action(eventMethods.update)
