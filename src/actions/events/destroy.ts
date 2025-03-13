'use server'
import { action } from '@/actions/action'
import { EventMethods } from '@/services/events/methods'

export const destroyEventAction = action(EventMethods.destroy)
