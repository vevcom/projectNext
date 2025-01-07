'use server'
import { Action } from '@/actions/Action'
import { destroyInterestGroup } from '@/services/groups/interestGroups/destroy'

export const destroyInterestGroupAction = Action(destroyInterestGroup)
