'use server'
import { action } from '@/actions/action'
import { readAllInterestGroups } from '@/services/groups/interestGroups/read'

export const readInterestGroupsAction = action(readAllInterestGroups)
