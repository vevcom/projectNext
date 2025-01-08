'use server'
import { action } from '@/actions/action'
import { updateEventTag } from '@/services/events/tags/update'

export const updateEventTagAction = action(updateEventTag)
