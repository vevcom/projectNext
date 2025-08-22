'use server'

import { action } from '@/services/action'
import { EventTagMethods } from '@/services/events/tags/methods'

export const createEventTagAction = action(EventTagMethods.create)

export const destroyEventTagAction = action(EventTagMethods.destroy)

export const readEventTagsAction = action(EventTagMethods.readAll)
export const readSpecialEventTagAction = action(EventTagMethods.readSpecial)
export const readEventTagAction = action(EventTagMethods.read)

export const updateEventTagAction = action(EventTagMethods.update)
