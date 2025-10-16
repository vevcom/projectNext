'use server'

import { makeAction } from '@/services/serverAction'
import { eventOperations } from '@/services/events/operations'

export const createEventAction = makeAction(eventOperations.create)

export const destroyEventAction = makeAction(eventOperations.destroy)

export const readCurrentEventsAction = makeAction(eventOperations.readManyCurrent)
export const readEventAction = makeAction(eventOperations.read)
export const readArchivedEventsPageAction = makeAction(eventOperations.readManyArchivedPage)

export const updateEventAction = makeAction(eventOperations.update)
export const updateEventParagraphContentAction = makeAction(eventOperations.updateParagraphContent)
