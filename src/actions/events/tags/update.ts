'use server'
import { Action } from '@/actions/Action'
import { updateEventTag } from '@/services/events/tags/update'

export const updateEventTagAction = Action(updateEventTag)
