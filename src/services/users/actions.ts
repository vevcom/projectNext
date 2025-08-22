'use server'

import { action } from '@/actions/action'
import { GroupMethods } from '@/services/groups/methods'
import { UserMethods } from '@/services/users/methods'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param rawdata - The user to create
 * @returns - The created user
 */
export const createUserAction = action(UserMethods.create)

/**
 * Action to destroy a user by the given id
 * @param id - The id of the user to destroy
 * @returns
 */
export const destroyUserAction = action(UserMethods.destroy)

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

export const updateUserAction = action(UserMethods.update)
export const registerNewEmailAction = action(UserMethods.registerNewEmail)
export const registerUser = action(UserMethods.register)
export const registerStudentCardInQueueAction = action(UserMethods.registerStudentCardInQueue)
