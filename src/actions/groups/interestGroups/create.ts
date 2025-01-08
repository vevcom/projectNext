'use server'
import { action } from '@/actions/action'
import { createInterestGroup } from '@/services/groups/interestGroups/create'

export const createInterestGroupAction = action(createInterestGroup)
