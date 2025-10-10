'use server'

import { action } from '@/services/action'
import { dotOperations } from '@/services/dots/operations'

export const createDotAction = action(dotOperations.create)

export const readDotPageAction = action(dotOperations.readPage)

export const readDotWrappersForUserAction = action(dotOperations.readWrappersForUser)
