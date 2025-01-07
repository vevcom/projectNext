'use server'
import { Action } from '@/actions/Action'
import { readAllEventTags, readEventTag, readSpecialEventTag } from '@/services/events/tags/read'

export const readEventTagsAction = Action(readAllEventTags)
export const readSpecialEventTagAction = Action(readSpecialEventTag)
export const readEventTagAction = Action(readEventTag)
