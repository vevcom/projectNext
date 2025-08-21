'use server'
import { action } from '@/actions/action'
import { UserMethods } from '@/services/users/methods'
import { GroupMethods } from '@/services/groups/methods'

/**
 * A action to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export const readUserPageAction = action(UserMethods.readPage)

/**
 * Action meant to read the profile of a user.
 * A profile is a user with more information about them attached.
 * @param username - The username of the user to read
 * @returns - The profile of the user
 */
export const readUserProfileAction = action(UserMethods.readProfile)

export const readUserAction = action(UserMethods.read)

export const readGroupsForPageFilteringAction = action(GroupMethods.readGroupsExpanded)

