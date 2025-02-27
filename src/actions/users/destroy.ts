'use server'
import { action } from '@/actions/action'
import { UserMethods } from '@/services/users/methods'

/**
 * Action to destroy a user by the given id
 * @param id - The id of the user to destroy
 * @returns
 */
export const destroyUserAction = action(UserMethods.destroy)

