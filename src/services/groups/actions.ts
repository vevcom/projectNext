'use server'

import { action } from '@/services/action'
import { groupMethods } from '@/services/groups/methods'

export const readGroupsAction = action(groupMethods.readGroups)
export const readGroupExpandedAction = action(groupMethods.readGroupExpanded)
export const readGroupsExpandedAction = action(groupMethods.readGroupsExpanded)
export const readGroupsStructuredAction = action(groupMethods.readGroupsStructured)
