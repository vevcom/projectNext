'use server'
import { action } from '@/actions/action'
import { destroyInterestGroup } from '@/services/groups/interestGroups/destroy'

export const destroyInterestGroupAction = action(destroyInterestGroup)
