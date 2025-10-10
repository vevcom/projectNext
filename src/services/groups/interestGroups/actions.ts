'use server'

import { action } from '@/services/action'
import { interestGroupMethods } from '@/services/groups/interestGroups/methods'

export const createInterestGroupAction = action(interestGroupMethods.create)

export const destroyInterestGroupAction = action(interestGroupMethods.destroy)

export const readInterestGroupsAction = action(interestGroupMethods.readMany)

export const updateInterestGroupAction = action(interestGroupMethods.update)
