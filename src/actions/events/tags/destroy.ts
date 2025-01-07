'use server'
import { Action } from '@/actions/Action'
import { destroyEventTag } from '@/services/events/tags/destroy'

export const destroyEventTagAction = Action(destroyEventTag)
