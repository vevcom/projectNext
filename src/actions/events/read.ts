'use server'
import { action } from '@/actions/action'
import { EventMethods } from '@/services/events/methods'

export const readCurrentEventsAction = action(EventMethods.readManyCurrent)
export const readEventAction = action(EventMethods.read)
export const readArchivedEventsPageAction = action(EventMethods.readManyArchivedPage)
