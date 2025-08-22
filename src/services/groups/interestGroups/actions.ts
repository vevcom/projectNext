'use server'

import { action } from '@/services/action'
import { InterestGroupMethods } from '@/services/groups/interestGroups/methods'

export const createInterestGroupAction = action(InterestGroupMethods.create)

export const destroyInterestGroupAction = action(InterestGroupMethods.destroy)

export const readInterestGroupsAction = action(InterestGroupMethods.readMany)

export const updateInterestGroupAction = action(InterestGroupMethods.update)
