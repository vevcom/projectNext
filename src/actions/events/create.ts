'use server'
import { action } from '@/actions/action'
import { createEvent } from '@/services/events/create'

export const createEventAction = action(createEvent)
