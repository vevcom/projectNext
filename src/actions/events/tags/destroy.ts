'use server'
import { action } from '@/actions/action'
import { destroyEventTag } from '@/services/events/tags/destroy'

export const destroyEventTagAction = action(destroyEventTag)
