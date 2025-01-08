'use server'
import { action } from '@/actions/action'
import { updateEvent } from '@/services/events/update'

export const updateEventAction = action(updateEvent)
