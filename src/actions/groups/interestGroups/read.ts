'use server'
import { action } from '@/actions/action'
import { InterestGroupMethods } from '@/services/groups/interestGroups/methods'

export const readInterestGroupsAction = action(InterestGroupMethods.read)
