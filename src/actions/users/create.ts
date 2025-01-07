'use server'
import { Action } from '@/actions/Action'
import { createUser } from '@/services/users/create'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param rawdata - The user to create
 * @returns - The created user
 */
export const createUserAction = Action(createUser)
