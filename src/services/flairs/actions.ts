'use server'

import { makeAction } from '@/services/serverAction'
import { flairOperations } from '@/services/flairs/operations'

export const createFlairAction = makeAction(flairOperations.create)
export const destroyFlairAction = makeAction(flairOperations.destroy)
export const readFlairAction = makeAction(flairOperations.read)
