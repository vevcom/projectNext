'use server'

import { action } from '@/actions/action'
import { destroyEvent } from '@/services/events/destroy'

export const destroyEventAction = action(destroyEvent)
