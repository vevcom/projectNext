'use server'
import { action } from '@/actions/action'
import { eventMethods } from '@/services/events/methods'

export const readCurrentEventsAction = action(eventMethods.readManyCurrent)

export const readEventAction = action(eventMethods.read)

export const readArchivedEventsPageAction = action(eventMethods.readManyArchivedPage)
