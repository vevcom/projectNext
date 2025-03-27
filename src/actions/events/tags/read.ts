'use server'
import { action } from '@/actions/action'
import { EventTagMethods } from '@/services/events/tags/methods'

export const readEventTagsAction = action(EventTagMethods.readAll)
export const readSpecialEventTagAction = action(EventTagMethods.readSpecial)
export const readEventTagAction = action(EventTagMethods.read)
