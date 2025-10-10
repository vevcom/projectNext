'use server'

import { action } from '@/services/action'
import { eventOperations } from '@/services/events/operations'

export const createEventAction = action(eventOperations.create)

export const destroyEventAction = action(eventOperations.destroy)

export const readCurrentEventsAction = action(eventOperations.readManyCurrent)
export const readEventAction = action(eventOperations.read)
export const readArchivedEventsPageAction = action(eventOperations.readManyArchivedPage)

export const updateEventAction = action(eventOperations.update)
