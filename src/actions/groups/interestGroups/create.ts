'use server'
import { Action } from '@/actions/Action'
import { InterestGroups } from '@/services/groups/interestGroups'

export const createInterestGroupAction = Action(InterestGroups.create)
