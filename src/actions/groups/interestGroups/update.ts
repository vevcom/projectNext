'use server'
import { Action } from '@/actions/Action'
import { updateInterestGroup } from '@/services/groups/interestGroups/update'

export const updateInterestGroupAction = Action(updateInterestGroup)
