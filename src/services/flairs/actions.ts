'use server'

import { makeAction } from '@/services/serverAction'
import { flairOperations } from '@/services/flairs/operations'

export const createFlairAction = makeAction(flairOperations.create)
export const updateFlairAction = makeAction(flairOperations.update)
export const destroyFlairAction = makeAction(flairOperations.destroy)

export const readFlairAction = makeAction(flairOperations.read)
export const readAllFlairsAction = makeAction(flairOperations.readAll)
export const readUserFlairsAction = makeAction(flairOperations.readUserFlairs)
export const readUserFlairsIdAction = makeAction(flairOperations.readUserFlairsId)

export const assignFlairToUserAction = makeAction(flairOperations.assignToUser)
export const unAssignFlairToUserAction = makeAction(flairOperations.unAssignToUser)
