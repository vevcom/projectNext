'use server'
import { action } from '@/actions/action'
import { eventMethods } from '@/services/events/methods'

export const createEventAction = action(eventMethods.create)
