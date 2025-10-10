'use server'

import { action } from '@/services/action'
import { groupOperations } from '@/services/groups/operations'

export const readGroupsAction = action(groupOperations.readGroups)
export const readGroupExpandedAction = action(groupOperations.readGroupExpanded)
export const readGroupsExpandedAction = action(groupOperations.readGroupsExpanded)
export const readGroupsStructuredAction = action(groupOperations.readGroupsStructured)
