'use server'

import { action } from '@/services/action'
import { interestGroupOperations } from '@/services/groups/interestGroups/operations'

export const createInterestGroupAction = action(interestGroupOperations.create)

export const destroyInterestGroupAction = action(interestGroupOperations.destroy)

export const readInterestGroupsAction = action(interestGroupOperations.readMany)

export const updateInterestGroupAction = action(interestGroupOperations.update)
