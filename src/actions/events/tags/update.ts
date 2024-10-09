'use server'
import { Action } from '@/actions/Action'
import { EventTags } from '@/services/events/tags'

export const updateEventTagAction = Action(EventTags.update)
