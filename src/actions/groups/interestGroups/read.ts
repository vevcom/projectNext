'use server'
import { ActionNoData } from '@/actions/Action'
import { InterestGroups } from '@/services/groups/interestGroups'

export const readInterestGroupsAction = ActionNoData(InterestGroups.readAll)
