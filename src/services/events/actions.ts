'use server'

import { action } from '@/services/action'
import { EventMethods } from '@/services/events/methods'

export const createEventAction = action(EventMethods.create)

export const destroyEventAction = action(EventMethods.destroy)

export const readCurrentEventsAction = action(EventMethods.readManyCurrent)
export const readEventAction = action(EventMethods.read)
export const readArchivedEventsPageAction = action(EventMethods.readManyArchivedPage)

export const updateEventAction = action(EventMethods.update)
