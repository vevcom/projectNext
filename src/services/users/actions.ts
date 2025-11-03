'use server'

import { makeAction } from '@/services/serverAction'
import { groupOperations } from '@/services/groups/operations'
import { userOperations } from '@/services/users/operations'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param rawdata - The user to create
 * @returns - The created user
 */
export const createUserAction = makeAction(userOperations.create)

/**
 * Action to destroy a user by the given id
 * @param id - The id of the user to destroy
 * @returns
 */
export const destroyUserAction = makeAction(userOperations.destroy)

/**
 * A action to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export const readUserPageAction = makeAction(userOperations.readPage)

/**
 * Action meant to read the profile of a user.
 * A profile is a user with more information about them attached.
 * @param username - The username of the user to read
 * @returns - The profile of the user
 */
export const readUserProfileAction = makeAction(userOperations.readProfile)

export const readUserAction = makeAction(userOperations.read)

export const readGroupsForPageFilteringAction = makeAction(groupOperations.readGroupsExpanded)

export const updateUserAction = makeAction(userOperations.update)
export const registerNewEmailAction = makeAction(userOperations.registerNewEmail)
export const registerUser = makeAction(userOperations.register)

export const connectStudentCardAction = makeAction(userOperations.connectStudentCard)
