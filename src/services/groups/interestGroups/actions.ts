'use server'

import { makeAction } from '@/services/serverAction'
import { interestGroupOperations } from '@/services/groups/interestGroups/operations'

export const createInterestGroupAction = makeAction(interestGroupOperations.create)

export const destroyInterestGroupAction = makeAction(interestGroupOperations.destroy)

export const readInterestGroupsAction = makeAction(interestGroupOperations.readMany)

export const updateInterestGroupAction = makeAction(interestGroupOperations.update)
