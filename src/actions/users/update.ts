'use server'
import { action } from '@/actions/action'
import { UserMethods } from '@/services/users/methods'

export const updateUserAction = action(UserMethods.update)
export const registerNewEmailAction = action(UserMethods.registerNewEmail)
export const registerUser = action(UserMethods.register)
export const registerStudentCardInQueueAction = action(UserMethods.registerStudentCardInQueue)
