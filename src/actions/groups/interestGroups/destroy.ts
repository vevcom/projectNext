'use server'
import { ActionNoData } from '@/actions/Action'
import { InterestGroups } from '@/services/groups/interestGroups'

export const destroyInterestGroupAction = ActionNoData(InterestGroups.destroy)
