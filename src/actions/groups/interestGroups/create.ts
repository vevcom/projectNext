'use server'
import { Action } from '@/actions/Action'
import { createInterestGroup } from '@/services/groups/interestGroups/create'

export const createInterestGroupAction = Action(createInterestGroup)
