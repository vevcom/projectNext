'use server'
import { Action } from '@/actions/Action'
import { readAllInterestGroups } from '@/services/groups/interestGroups/read'

export const readInterestGroupsAction = Action(readAllInterestGroups)
