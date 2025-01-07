'use server'
import { Action } from '@/actions/Action'
import { createEventTag } from '@/services/events/tags/create'

export const createEventTagAction = Action(createEventTag)
