'use server'
import { action } from '@/actions/action'
import { GroupMethods } from '@/services/groups/methods'

export const readGroupsAction = action(GroupMethods.readGroups)
export const readGroupExpandedAction = action(GroupMethods.readGroupExpanded)
export const readGroupsExpandedAction = action(GroupMethods.readGroupsExpanded)
export const readGroupsStructuredAction = action(GroupMethods.readGroupsStructured)
