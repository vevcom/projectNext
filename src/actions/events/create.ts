'use server'
import { Action } from '@/actions/Action'
import { createEvent } from '@/services/events/create'

export const createEventAction = Action(createEvent)
