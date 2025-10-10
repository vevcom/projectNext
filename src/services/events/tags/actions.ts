'use server'

import { action } from '@/services/action'
import { eventTagMethods } from '@/services/events/tags/methods'

export const createEventTagAction = action(eventTagMethods.create)

export const destroyEventTagAction = action(eventTagMethods.destroy)

export const readEventTagsAction = action(eventTagMethods.readAll)
export const readSpecialEventTagAction = action(eventTagMethods.readSpecial)
export const readEventTagAction = action(eventTagMethods.read)

export const updateEventTagAction = action(eventTagMethods.update)
