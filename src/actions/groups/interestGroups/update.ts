'use server'
import { action } from '@/actions/action'
import { updateInterestGroup } from '@/services/groups/interestGroups/update'

export const updateInterestGroupAction = action(updateInterestGroup)
