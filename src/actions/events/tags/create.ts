'use server'
import { action } from '@/actions/action'
import { createEventTag } from '@/services/events/tags/create'

export const createEventTagAction = action(createEventTag)
