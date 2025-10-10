'use server'

import { action } from '@/services/action'
import { eventTagOperations } from '@/services/events/tags/operations'

export const createEventTagAction = action(eventTagOperations.create)

export const destroyEventTagAction = action(eventTagOperations.destroy)

export const readEventTagsAction = action(eventTagOperations.readAll)
export const readSpecialEventTagAction = action(eventTagOperations.readSpecial)
export const readEventTagAction = action(eventTagOperations.read)

export const updateEventTagAction = action(eventTagOperations.update)
