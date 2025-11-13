'use server'

import { makeAction } from '@/services/serverAction'
import { groupOperations } from '@/services/groups/operations'

export const readGroupsAction = makeAction(groupOperations.readGroups)
export const readGroupExpandedAction = makeAction(groupOperations.readGroupExpanded)
export const readGroupsExpandedAction = makeAction(groupOperations.readGroupsExpanded)
export const readGroupsStructuredAction = makeAction(groupOperations.readGroupsStructured)
