'use server'

import { action } from '@/services/action'
import { groupOperations } from '@/services/groups/operations'
import { userOperations } from '@/services/users/operations'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param rawdata - The user to create
 * @returns - The created user
 */
export const createUserAction = action(userOperations.create)

/**
 * Action to destroy a user by the given id
 * @param id - The id of the user to destroy
 * @returns
 */
export const destroyUserAction = action(userOperations.destroy)

/**
 * A action to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export const readUserPageAction = action(userOperations.readPage)

/**
 * Action meant to read the profile of a user.
 * A profile is a user with more information about them attached.
 * @param username - The username of the user to read
 * @returns - The profile of the user
 */
export const readUserProfileAction = action(userOperations.readProfile)

export const readUserAction = action(userOperations.read)

export const readGroupsForPageFilteringAction = action(groupOperations.readGroupsExpanded)

export const updateUserAction = action(userOperations.update)
export const registerNewEmailAction = action(userOperations.registerNewEmail)
export const registerUser = action(userOperations.register)
export const registerStudentCardInQueueAction = action(userOperations.registerStudentCardInQueue)
