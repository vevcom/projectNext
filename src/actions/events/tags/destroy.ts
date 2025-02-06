'use server'
import { action } from '@/actions/action'
import { eventTagMethods } from '@/services/events/tags/methods'

export const destroyEventTagAction = action(eventTagMethods.destroy)
