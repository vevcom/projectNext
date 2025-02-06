'use server'
import { action } from '@/actions/action'
import { eventTagMethods } from '@/services/events/tags/methods'

export const readEventTagsAction = action(eventTagMethods.readAll)
export const readSpecialEventTagAction = action(eventTagMethods.readSpecial)
export const readEventTagAction = action(eventTagMethods.read)
