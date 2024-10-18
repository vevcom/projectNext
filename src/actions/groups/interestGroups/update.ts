'use server'
import { Action } from '@/actions/Action'
import { InterestGroups } from '@/services/groups/interestGroups'

export const updateInterestGroupAction = Action(InterestGroups.update)
