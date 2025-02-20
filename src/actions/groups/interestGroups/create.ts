'use server'
import { action } from '@/actions/action'
import { interestGroupMethods } from '@/services/groups/interestGroups/methods'

export const createInterestGroupAction = action(interestGroupMethods.create)
