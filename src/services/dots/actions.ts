'use server'

import { action } from '@/actions/action'
import { dotMethods } from '@/services/dots/methods'

export const createDotAction = action(dotMethods.create)

export const readDotPageAction = action(dotMethods.readPage)

export const readDotWrappersForUserAction = action(dotMethods.readWrappersForUser)
