'use server'

import { action } from '@/services/action'
import { groupMethods } from '@/services/groups/methods'
import { userMethods } from '@/services/users/methods'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param rawdata - The user to create
 * @returns - The created user
 */
export const createUserAction = action(userMethods.create)

/**
 * Action to destroy a user by the given id
 * @param id - The id of the user to destroy
 * @returns
 */
export const destroyUserAction = action(userMethods.destroy)

/**
 * A action to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export const readUserPageAction = action(userMethods.readPage)

/**
 * Action meant to read the profile of a user.
 * A profile is a user with more information about them attached.
 * @param username - The username of the user to read
 * @returns - The profile of the user
 */
export const readUserProfileAction = action(userMethods.readProfile)

export const readUserAction = action(userMethods.read)

export const readGroupsForPageFilteringAction = action(groupMethods.readGroupsExpanded)

export const updateUserAction = action(userMethods.update)
export const registerNewEmailAction = action(userMethods.registerNewEmail)
export const registerUser = action(userMethods.register)
export const registerStudentCardInQueueAction = action(userMethods.registerStudentCardInQueue)
