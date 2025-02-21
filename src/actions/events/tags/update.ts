'use server'
import { action } from '@/actions/action'
import { EventTagMethods } from '@/services/events/tags/methods'

export const updateEventTagAction = action(EventTagMethods.update)
