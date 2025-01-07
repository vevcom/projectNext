'use server'

import { Action } from '@/actions/Action'
import { destroyEvent } from '@/services/events/destroy'

export const destroyEventAction = Action(destroyEvent)
