'use server'
import { action } from '@/actions/action'
import { InterestGroupMethods } from '@/services/groups/interestGroups/methods'

export const updateInterestGroupAction = action(InterestGroupMethods.update)
