'use server'
import { action } from '@/actions/action'
import { UserMethods } from '@/services/users/methods'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param rawdata - The user to create
 * @returns - The created user
 */
export const createUserAction = action(UserMethods.create)
