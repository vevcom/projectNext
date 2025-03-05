'use server'
import { action } from '@/actions/action'
import { EventTagMethods } from '@/services/events/tags/methods'

export const createEventTagAction = action(EventTagMethods.create)
