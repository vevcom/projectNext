'use server'
import { Action } from '@/actions/Action'
import { updateEvent } from '@/services/events/update'

export const updateEventAction = Action(updateEvent)
