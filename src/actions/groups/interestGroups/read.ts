'use server'
import { action } from '@/actions/action'
import { interestGroupMethods } from '@/services/groups/interestGroups/methods'

export const readInterestGroupsAction = action(interestGroupMethods.read)
