'use server'

import { makeAction } from '@/services/serverAction'
import { dotOperations } from '@/services/dots/operations'

export const createDotAction = makeAction(dotOperations.create)

export const readDotPageAction = makeAction(dotOperations.readPage)

export const readDotWrappersForUserAction = makeAction(dotOperations.readWrappersForUser)
