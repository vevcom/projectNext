'use server'
import { action } from '@/actions/action'
import { EventMethods } from '@/services/events/methods'

export const updateEventAction = action(EventMethods.update)
