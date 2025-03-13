'use server'
import { action } from '@/actions/action'
import { dotMethods } from '@/services/dots/methods'

export const readDotPageAction = action(dotMethods.readPage)

export const readDotWrappersForUserAction = action(dotMethods.readWrappersForUser)
