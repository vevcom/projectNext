'use server'

import { makeAction } from '@/services/serverAction'
import { eventTagOperations } from '@/services/events/tags/operations'

export const createEventTagAction = makeAction(eventTagOperations.create)

export const destroyEventTagAction = makeAction(eventTagOperations.destroy)

export const readEventTagsAction = makeAction(eventTagOperations.readAll)
export const readSpecialEventTagAction = makeAction(eventTagOperations.readSpecial)
export const readEventTagAction = makeAction(eventTagOperations.read)

export const updateEventTagAction = makeAction(eventTagOperations.update)
