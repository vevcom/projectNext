'use server'
import { action } from '@/actions/action'
import { readAllEventTags, readEventTag, readSpecialEventTag } from '@/services/events/tags/read'

export const readEventTagsAction = action(readAllEventTags)
export const readSpecialEventTagAction = action(readSpecialEventTag)
export const readEventTagAction = action(readEventTag)
