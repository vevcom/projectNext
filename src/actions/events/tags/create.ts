'use server'
import { EventTags } from '@/services/events/tags'
import { Action } from '@/actions/Action'

export const createEventTagAction = Action(EventTags.create)
